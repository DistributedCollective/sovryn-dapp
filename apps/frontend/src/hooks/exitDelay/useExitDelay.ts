import { useEffect, useMemo, useRef, useState } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { startCall } from '../../store/rxjs/provider-cache';
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
 * however long the form stays open. The timer's own force is passed all the
 * way into the quote itself (see `quoteExitDelay`'s `force`), not stopped at
 * this hook's outer cache entry, so the bound is one lifetime and not two:
 * the quote a forced tick reads is never older than the tick itself. The
 * withdrawal itself is held on chain from the moment of arming either way;
 * this hook's number is what can be briefly behind, not the money. Do not
 * add a key on live policy state to close that window further — the bound
 * above is the accepted one.
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

  // `force` reaches quoteExitDelay's own cached read (see its doc comment)
  // so a forced tick re-reads the chain instead of serving whatever that
  // inner cache still holds from before this tick. An ordinary call passes
  // no `force` at all — not `force: false` — so it is indistinguishable
  // from any other unforced caller and still shares that inner cache's
  // answer with them.
  const fetchQuote = async (force?: boolean): Promise<StampedDelay> => {
    if (!consumerAddress || !subProduct || !account) {
      return { delaySeconds: 0, unknown: false, forKey: PENDING_KEY };
    }
    const quote = await quoteExitDelay({
      chainId,
      consumerAddress,
      account,
      surfaceId,
      subProduct,
      force,
    });
    return { ...quote, forKey: key };
  };

  // See REQUOTE_INTERVAL_MS: on each tick, forces the shared cache entry for
  // this exact id directly, rather than threading `force` through
  // useCacheCall's own effect below. That effect also re-runs on every
  // ordinary block-driven change (any mounted instance's block ticking
  // forward), and a `force` living in its options would ride along on
  // those runs too — exactly as many times as there are mounted
  // instances of this hook for the same key — defeating the de-dup two
  // forms sharing a key rely on to share one on-chain read per block. The
  // tick also calls `fetchQuote` with its own `force: true`, so the force
  // reaches the quote itself (quoteExitDelay's own `force`) rather than
  // stopping at this outer cache entry: without that, this entry's forced
  // re-fetch could still be served the quote's own, not-yet-expired,
  // cached answer from before the tick. A ref keeps the interval itself
  // stable across renders (so it is not torn down and restarted on every
  // block) while still calling with each render's latest values.
  const latest = useRef({ id: `call:${chainId}:${key}`, fetchQuote });
  latest.current = { id: `call:${chainId}:${key}`, fetchQuote };
  useEffect(() => {
    const timer = setInterval(() => {
      const { id, fetchQuote } = latest.current;
      startCall(id, () => fetchQuote(true), {
        ttl: EXIT_DELAY_TTL,
        force: true,
      });
    }, REQUOTE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const { value } = useCacheCall<StampedDelay>(
    key,
    chainId,
    fetchQuote,
    [key],
    { delaySeconds: 0, unknown: false, forKey: PENDING_KEY },
    { ttl: EXIT_DELAY_TTL },
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
