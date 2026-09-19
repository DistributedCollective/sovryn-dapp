import { useEffect, useMemo, useState } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { EXIT_DELAY_TTL, ExitDelayQuote } from '../../utils/exitDelay';
import { useCacheCall } from '../useCacheCall';
import { ResolvedExitDelay, quoteExitDelay } from './quoteExitDelay';

/**
 * How long a form waits for a delay quote before reporting it as unreadable.
 * Long enough for the handful of reads a quote takes on a slow node, short
 * enough that a stalled read does not keep Confirm disabled.
 */
export const EXIT_DELAY_QUOTE_TIMEOUT_MS = 10_000;

/**
 * How often an open form re-checks its own delay quote, regardless of
 * whether a new block has arrived.
 *
 * The shared cache behind `useCacheCall` only re-invokes its fetch when the
 * block number it tracks moves, or when this hook's own key changes — never
 * on a bare timer. On a chain where blocks come only with transactions, a
 * form left open across an unrelated policy change (the Owner arming or
 * disarming the delay) can see no new block at all for as long as it stays
 * mounted, so without this its quote would never refresh on its own: not
 * "briefly behind" as `EXIT_DELAY_TTL` describes, but indefinitely. This
 * forces a fresh read on a bound tied to that same TTL, so an open form is
 * never more than one cache lifetime behind a change made while it is open.
 */
const REQUOTE_INTERVAL_MS = EXIT_DELAY_TTL;

export type ExitDelayRequest = {
  chainId: ChainId;
  /** The consumer holding the perimeter pointers; undefined while it loads. */
  consumerAddress?: string;
  /** True when the consumer's address could not be resolved at all. */
  consumerUnresolvable?: boolean;
  surfaceId: string;
  /** The product the withdrawal leaves; undefined while it loads. */
  subProduct?: string;
  account?: string;
  timeoutMs?: number;
};

type StampedDelay = ResolvedExitDelay & { forKey: string };

/** No fetch stamps its result with this, so a default is never an answer. */
const PENDING_KEY = '';

const LOADING: ExitDelayQuote = {
  delaySeconds: 0,
  unknown: false,
  loading: true,
};

const NOT_READ: ExitDelayQuote = {
  delaySeconds: 0,
  unknown: true,
  loading: false,
};

/** No wallet: no withdrawal can be signed, so there is nothing to describe. */
const NO_WITHDRAWAL: ExitDelayQuote = {
  delaySeconds: 0,
  unknown: false,
  loading: false,
};

/** Whether `timeoutMs` has passed since `key` was first asked without it settling. */
export const useDeadlinePassed = (
  key: string,
  settled: boolean,
  timeoutMs: number,
): boolean => {
  const [passedFor, setPassedFor] = useState<string>();

  useEffect(() => {
    if (settled) {
      return;
    }
    const timer = setTimeout(() => setPassedFor(key), timeoutMs);
    return () => clearTimeout(timer);
  }, [key, settled, timeoutMs]);

  return passedFor === key;
};

/**
 * The withdrawal delay for one surface, as a form should show it.
 *
 * The shared cache hands back its default until a block number is known and
 * keeps a changed key's previous value until the new fetch lands, so every
 * quote is stamped with the key it was fetched for: chain, consumer, surface,
 * product and account. Anything else — the default, a value for another key, a
 * consumer or product still loading — is reported as loading, never as a
 * delay of zero. A quote that has not arrived within `timeoutMs` is reported
 * as unreadable, which shows the warning and lets the user sign.
 *
 * That "changed key" guard does not cover the moment the withdrawal delay is
 * first armed for a surface: the key above does not include the delay value,
 * so a quote fetched just before arming and still within `EXIT_DELAY_TTL` is
 * served as-is, unaware anything changed. A form left open across that
 * moment can under-report the hold, but the requote timer below (see
 * REQUOTE_INTERVAL_MS) bounds that lag to at most one cache lifetime, the
 * same window a fresh block would already have closed — never indefinitely,
 * however long the form stays open. The withdrawal itself is held on chain
 * from the moment of arming either way; this hook's number is what can be
 * briefly behind, not the money. Do not add a key on live policy state to
 * close that window further — the bound above is the accepted one.
 */
export const useExitDelay = ({
  chainId,
  consumerAddress,
  consumerUnresolvable = false,
  surfaceId,
  subProduct,
  account,
  timeoutMs = EXIT_DELAY_QUOTE_TIMEOUT_MS,
}: ExitDelayRequest): ExitDelayQuote => {
  const key = [
    'exitDelay/quote',
    chainId,
    consumerAddress?.toLowerCase(),
    surfaceId,
    subProduct?.toLowerCase(),
    account?.toLowerCase(),
  ].join('/');

  // See REQUOTE_INTERVAL_MS: forces a fresh read on a bound timer so a form
  // left open is never indefinitely stale, only briefly so, the same way a
  // block change already would.
  const [requoteTick, setRequoteTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setRequoteTick(tick => tick + 1),
      REQUOTE_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, []);

  const { value } = useCacheCall<StampedDelay>(
    key,
    chainId,
    async () => {
      if (!consumerAddress || !subProduct || !account) {
        return { delaySeconds: 0, unknown: false, forKey: PENDING_KEY };
      }
      const quote = await quoteExitDelay({
        chainId,
        consumerAddress,
        account,
        surfaceId,
        subProduct,
      });
      return { ...quote, forKey: key };
    },
    [key, requoteTick],
    { delaySeconds: 0, unknown: false, forKey: PENDING_KEY },
    { ttl: EXIT_DELAY_TTL, force: true },
  );

  const fresh = value.forKey === key;
  const deadlinePassed = useDeadlinePassed(
    key,
    !account || consumerUnresolvable || fresh,
    timeoutMs,
  );

  return useMemo(() => {
    if (!account) {
      return NO_WITHDRAWAL;
    }
    if (consumerUnresolvable) {
      return NOT_READ;
    }
    if (fresh) {
      return {
        delaySeconds: value.delaySeconds,
        unknown: value.unknown,
        loading: false,
      };
    }
    return deadlinePassed ? NOT_READ : LOADING;
  }, [account, consumerUnresolvable, deadlinePassed, fresh, value]);
};
