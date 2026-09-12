import { useEffect, useMemo, useState } from 'react';

import { ChainId, getProvider } from '@sovryn/ethers-provider';

import { EXIT_DELAY_TTL } from '../../utils/exitDelay';
import { useCacheCall } from '../useCacheCall';

type Anchor = {
  /** Latest block timestamp, in seconds. 0 until one has been read. */
  timestamp: number;
  /** Local clock reading taken with it, used only for elapsed time. */
  readAt: number;
};

const NO_ANCHOR: Anchor = { timestamp: 0, readAt: 0 };

export type ChainClock = {
  /**
   * The chain's time in seconds, or 0 until the first block has been read.
   * Callers must treat 0 as "not known yet" rather than as the epoch — a
   * countdown or a release decision made against 0 would be nonsense.
   */
  now: number;
  /**
   * The latest block's own timestamp, in seconds, or 0 until one has been
   * read. It does not tick: the queue compares it, so whether a release can
   * pass is judged against it, not against `now`.
   */
  blockTime: number;
  /**
   * True when the block read failed and no time is known, so a caller can say
   * it could not read instead of waiting for a time that will not arrive.
   */
  unreadable: boolean;
};

/**
 * The chain's clock, ticking each second.
 *
 * The queue compares `block.timestamp`, so anything decided from `Date.now()`
 * is decided from the user's own machine: a clock a couple of minutes fast
 * flips a still-locked hold to "Ready", and the release reverts NotUnlocked —
 * inside a batch, taking every other ready hold down with it. A slow clock
 * withholds a release the holder is entitled to.
 *
 * So the value is anchored to the latest block's timestamp, refreshed with the
 * block, and advanced between refreshes by ELAPSED local time. A wrong local
 * offset cancels out in the subtraction; only the machine's clock RATE could
 * drift, and no machine drifts a second per second.
 */
export const useChainTime = (chainId: ChainId): ChainClock => {
  const { value: anchor, error } = useCacheCall<Anchor>(
    `exitDelay/chainTime/${chainId}`,
    chainId,
    async () => {
      const block = await getProvider(chainId).getBlock('latest');
      return { timestamp: block.timestamp, readAt: Date.now() };
    },
    [chainId],
    NO_ANCHOR,
    { ttl: EXIT_DELAY_TTL },
  );

  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!anchor.timestamp) {
      return;
    }
    const advance = () =>
      setNow(
        anchor.timestamp +
          Math.max(0, Math.floor((Date.now() - anchor.readAt) / 1000)),
      );
    advance();
    const timer = setInterval(advance, 1_000);
    return () => clearInterval(timer);
  }, [anchor.timestamp, anchor.readAt]);

  const unreadable = !anchor.timestamp && !!error;

  return useMemo(
    () => ({ now, blockTime: anchor.timestamp, unreadable }),
    [now, anchor.timestamp, unreadable],
  );
};
