import { useEffect, useMemo, useState } from 'react';

import { Contract } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../config/chains';

import {
  ExitStatus,
  PendingExit,
  RELEASE_READ_TIMEOUT_MS,
  exitKey,
  isStatedExitStatus,
} from '../../utils/exitDelay';
import { rememberExits, rememberedExits } from '../../utils/exitDelayHistory';
import { useAccount } from '../useAccount';
import { boundedBy } from './rawCall';
import { resolveAmount } from './usePerimeterVault';

const QUEUE_ABI = [
  'function getRequest(uint256 id) view returns (tuple(uint128 amount, uint64 createdAt, uint64 unlockAt, address originator, address owner, address receiver, address token, bytes32 surfaceId, address subProduct, uint8 status, bool unwrapOnDelivery))',
];

export type PerimeterHistory = {
  /** Withdrawals this browser remembers that are no longer waiting, read from chain. */
  exits: PendingExit[];
  loading: boolean;
  /** True when one of the remembered withdrawals could not be read. */
  unknown: boolean;
};

const EMPTY: PerimeterHistory = { exits: [], loading: false, unknown: false };

/** What a history read is an answer for: the switch and the account. */
type HistoryKey = { enabled: boolean; account: string | undefined };

/** Stamped with the key the state below is this hook's answer for. */
type HistoryState = PerimeterHistory & { stampedFor: HistoryKey };

const EMPTY_STATE: HistoryState = {
  ...EMPTY,
  stampedFor: { enabled: false, account: undefined },
};

/**
 * Released, or otherwise settled, withdrawals: the ids this browser has seen
 * for the account that are not in the live list, each read back from its
 * queue now. Remembers every live withdrawal it is shown so it can be found
 * again after it settles.
 */
export const usePerimeterHistory = (
  enabled: boolean,
  live: PendingExit[],
): PerimeterHistory => {
  const { account } = useAccount();
  const [history, setHistory] = useState<HistoryState>(EMPTY_STATE);

  const liveKeys = live.map(exitKey).join(',');

  useEffect(() => {
    if (account && live.length > 0) {
      rememberExits(RSK_CHAIN_ID, account, live);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, liveKeys]);

  useEffect(() => {
    if (!enabled || !account) {
      setHistory({ ...EMPTY, stampedFor: { enabled, account } });
      return;
    }
    let cancelled = false;
    setHistory({ ...EMPTY, loading: true, stampedFor: { enabled, account } });
    const remembered = rememberedExits(RSK_CHAIN_ID, account).filter(
      entry => !live.some(exit => exitKey(exit) === exitKey(entry)),
    );
    (async () => {
      const provider = getProvider(RSK_CHAIN_ID);
      let unknown = false;
      const exits: PendingExit[] = [];
      await Promise.all(
        remembered.map(async entry => {
          try {
            const queue = new Contract(entry.queueAddress, QUEUE_ABI, provider);
            const request = await boundedBy(
              queue.getRequest(entry.id),
              RELEASE_READ_TIMEOUT_MS,
            );
            const status = Number(request.status) as ExitStatus;
            if (status === ExitStatus.Queued) {
              return;
            }
            if (!isStatedExitStatus(status)) {
              // A remembered id answering with the zero status, or a value
              // outside the five the queue defines, is a read that did not
              // state the request, not a fact about it.
              unknown = true;
              return;
            }
            exits.push({
              id: entry.id,
              queueAddress: entry.queueAddress,
              ...resolveAmount(
                request.token,
                request.unwrapOnDelivery,
                request.amount,
              ),
              token: request.token,
              createdAt: Number(request.createdAt),
              unlockAt: Number(request.unlockAt),
              originator: request.originator,
              owner: request.owner,
              receiver: request.receiver,
              surfaceId: request.surfaceId,
              subProduct: request.subProduct,
              status,
              unwrapOnDelivery: request.unwrapOnDelivery,
            });
          } catch (error) {
            unknown = true;
          }
        }),
      );
      if (!cancelled) {
        exits.sort((a, b) => b.unlockAt - a.unlockAt);
        setHistory({
          exits,
          loading: false,
          unknown,
          stampedFor: { enabled, account },
        });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, account, liveKeys]);

  // A history not yet read for the current switch and account still belongs
  // to a previous request — the switch off, or a different account's read —
  // so the render that flips the switch on, or that follows an account
  // change, reports loading immediately rather than painting a previous
  // request's rows, or "nothing remembered", for a frame before the read for
  // this one has started.
  return useMemo(() => {
    const stale =
      history.stampedFor.enabled !== enabled ||
      history.stampedFor.account !== account;
    if (enabled && stale) {
      return { exits: [], loading: true, unknown: false };
    }
    const { stampedFor, ...rest } = history;
    return rest;
  }, [enabled, account, history]);
};
