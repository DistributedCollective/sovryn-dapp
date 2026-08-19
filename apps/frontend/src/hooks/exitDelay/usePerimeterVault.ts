import { useMemo } from 'react';

import { BigNumber, Contract, constants } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../config/chains';

import { asyncCall } from '../../store/rxjs/provider-cache';
import {
  BlockState,
  EXIT_DELAY_TTL,
  ExitStatus,
  PartyBlockStates,
  PendingExit,
} from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { useGetProtocolContract } from '../useGetContract';

export type PerimeterVault = {
  /** The queue holding this account's delayed exits, or undefined when unwired. */
  queueAddress?: string;
  exits: PendingExit[];
  /** Block state of every party of every exit, keyed by exit id. */
  blocks: Record<string, PartyBlockStates>;
  paused: boolean;
  loading: boolean;
};

const EMPTY: Omit<PerimeterVault, 'loading'> = {
  queueAddress: undefined,
  exits: [],
  blocks: {},
  paused: false,
};

const QUEUE_GETTER_ABI = ['function exitDelayQueue() view returns (address)'];

const QUEUE_ABI = [
  'function getActive(address party, uint256 cursor, uint256 n) view returns (uint256[] ids, uint256 nextCursor)',
  'function getRequest(uint256 id) view returns (tuple(uint128 amount, uint64 createdAt, uint64 unlockAt, address originator, address owner, address receiver, address token, bytes32 surfaceId, address subProduct, uint8 status, bool unwrapOnDelivery))',
  'function blockStateOf(address a) view returns (uint8)',
  'function securityPerimeterPaused() view returns (bool)',
];

/** The contract clamps a page to this; asking for more just wastes a round trip. */
const PAGE = 50;
/**
 * A hard stop on paging. `getActive` is best-effort over a mutating set, so a
 * concurrent removal can repeat an entry; without a cap a pathological cursor
 * sequence could spin. Fifty pages is far beyond any real holder's queue.
 */
const MAX_PAGES = 50;

/**
 * Every exit the perimeter currently holds for the connected account, with the
 * state each one is in.
 *
 * The queue is reached through the protocol's own pointer, the same route the
 * consumer contracts take. While the perimeter is undeployed or unwired the
 * lookup reverts, the result is cached empty, and the page renders as "nothing
 * held" rather than as an error.
 *
 * `getActive` is indexed by PARTY and an account is a party to an exit as
 * originator or owner, so this returns exits this account can execute. An exit
 * where the account is only the receiver does not appear — matching the
 * contract, where the receiver is paid but is never an executor.
 */
export const usePerimeterVault = (): PerimeterVault => {
  const { account } = useAccount();
  const protocol = useGetProtocolContract('protocol', RSK_CHAIN_ID);

  const { value, loading } = useCacheCall(
    `exitDelay/vault/${account}`,
    RSK_CHAIN_ID,
    async () => {
      if (!protocol || !account) {
        return EMPTY;
      }
      try {
        const getter = new Contract(
          protocol.address,
          QUEUE_GETTER_ABI,
          getProvider(RSK_CHAIN_ID),
        );
        const queueAddress: string = await asyncCall(
          `exitDelay/queueAddress/${RSK_CHAIN_ID}/${protocol.address}`,
          () => getter.exitDelayQueue(),
          { ttl: EXIT_DELAY_TTL },
        );
        if (!queueAddress || queueAddress === constants.AddressZero) {
          return EMPTY;
        }

        const queue = new Contract(
          queueAddress,
          QUEUE_ABI,
          getProvider(RSK_CHAIN_ID),
        );

        const ids: BigNumber[] = [];
        let cursor = BigNumber.from(0);
        for (let page = 0; page < MAX_PAGES; page++) {
          const result = await queue.getActive(account, cursor, PAGE);
          ids.push(...result.ids);
          cursor = result.nextCursor;
          if (cursor.isZero()) {
            break;
          }
        }

        const paused: boolean = await queue.securityPerimeterPaused();

        const exits: PendingExit[] = [];
        const blocks: Record<string, PartyBlockStates> = {};
        const blockCache = new Map<string, BlockState>();
        const blockStateOf = async (address: string): Promise<BlockState> => {
          const key = address.toLowerCase();
          const cached = blockCache.get(key);
          if (cached !== undefined) {
            return cached;
          }
          const state: BlockState = Number(await queue.blockStateOf(address));
          blockCache.set(key, state);
          return state;
        };

        for (const id of ids) {
          const request = await queue.getRequest(id);
          const exitId = id.toString();
          exits.push({
            id: exitId,
            amount: Decimal.fromBigNumberString(request.amount.toString()),
            token: request.token,
            createdAt: Number(request.createdAt),
            unlockAt: Number(request.unlockAt),
            originator: request.originator,
            owner: request.owner,
            receiver: request.receiver,
            surfaceId: request.surfaceId,
            subProduct: request.subProduct,
            status: Number(request.status) as ExitStatus,
            unwrapOnDelivery: request.unwrapOnDelivery,
          });
          blocks[exitId] = {
            originator: await blockStateOf(request.originator),
            owner: await blockStateOf(request.owner),
            receiver: await blockStateOf(request.receiver),
          };
        }

        // Soonest to unlock first: the row a holder is waiting on is the one
        // worth putting at the top.
        exits.sort((a, b) => a.unlockAt - b.unlockAt);

        return { queueAddress, exits, blocks, paused };
      } catch (error) {
        return EMPTY;
      }
    },
    [protocol?.address, account],
    EMPTY,
    { ttl: EXIT_DELAY_TTL },
  );

  return useMemo(
    () => ({
      queueAddress: value.queueAddress,
      exits: value.exits,
      blocks: value.blocks,
      paused: value.paused,
      loading,
    }),
    [value, loading],
  );
};
