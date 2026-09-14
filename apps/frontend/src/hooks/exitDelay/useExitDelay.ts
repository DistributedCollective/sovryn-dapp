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
