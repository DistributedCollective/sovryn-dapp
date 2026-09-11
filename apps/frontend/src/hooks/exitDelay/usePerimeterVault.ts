import { useMemo } from 'react';

import { BigNumber, Contract, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { getZeroContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../config/chains';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { findAssetByAddress, findNativeAsset } from '../../utils/asset';
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
import { readPerimeterPointer } from './readPerimeterPointer';

export type PerimeterVault = {
  exits: PendingExit[];
  /** Block state of every party of every exit, keyed by exit id. */
  blocks: Record<string, PartyBlockStates>;
  /** Whether releases are paused, per queue address (lower-cased). */
  pausedByQueue: Record<string, boolean>;
  /** True while any queue holding this account's exits is paused. */
  paused: boolean;
  loading: boolean;
  /**
   * True when the vault could not be read. NOT the same as nothing held: an
   * account with queued exits produces exactly the same empty list when a
   * round trip fails, and telling someone their funds are not held is the one
   * thing this page must never do on a guess.
   */
  unknown: boolean;
};

type StampedVault = Omit<PerimeterVault, 'loading'> & { forKey: string };

const EMPTY: Omit<PerimeterVault, 'loading'> = {
  exits: [],
  blocks: {},
  pausedByQueue: {},
  paused: false,
  unknown: false,
};

const UNREADABLE: Omit<PerimeterVault, 'loading'> = { ...EMPTY, unknown: true };

/** No fetch stamps its result with this, so a default value is never "fresh". */
const PENDING_KEY = '';

const QUEUE_ABI = [
  'function getActive(address party, uint256 cursor, uint256 n) view returns (uint256[] ids, uint256 nextCursor)',
  'function getRequest(uint256 id) view returns (tuple(uint128 amount, uint64 createdAt, uint64 unlockAt, address originator, address owner, address receiver, address token, bytes32 surfaceId, address subProduct, uint8 status, bool unwrapOnDelivery))',
  'function blockStateOf(address a) view returns (uint8)',
  'function securityPerimeterPaused() view returns (bool)',
];

/** The contract clamps a page to MAX_GET_ACTIVE_PAGE; asking for more wastes a round trip. */
const PAGE = 500;
/**
 * A hard stop on paging. `getActive` is best-effort over a mutating set, so a
 * concurrent removal can repeat an entry; without a cap a pathological cursor
 * sequence could spin. Fifty pages is far beyond any real holder's queue.
 */
const MAX_PAGES = 50;

/**
 * Every queue address each consumer has resolved to, remembered for the life
 * of the tab.
 *
 * The consumers' setters refuse the zero address but accept a new queue, and
 * requests left in the old queue are still held and still released there. So
 * a queue seen once stays listed after the pointer moves on. Deliberately in
 * memory only — a persisted address would be an attacker-supplied contract for
 * the release button to call after someone edited local storage.
 */
const knownQueues = new Map<string, Set<string>>();

/**
 * Follow one consumer's queue pointer.
 *
 * A getter the consumer does not have is a completed read with no queue; a
 * read that did not complete is reported so the page can say it could not
 * read rather than that nothing is held.
 */
const resolveQueues = async (
  consumerAddress: string,
): Promise<{ addresses: string[]; unknown: boolean }> => {
  const memoKey = `${RSK_CHAIN_ID}/${consumerAddress.toLowerCase()}`;
  const remembered = knownQueues.get(memoKey) ?? new Set<string>();
  const pointer = await readPerimeterPointer(
    RSK_CHAIN_ID,
    consumerAddress,
    'exitDelayQueue',
  );
  if (pointer.kind === 'address' && pointer.address !== constants.AddressZero) {
    remembered.add(pointer.address.toLowerCase());
    knownQueues.set(memoKey, remembered);
  }
  return {
    addresses: [...remembered],
    unknown: pointer.kind === 'unreadable',
  };
};

/**
 * Whether each of the given owner addresses carries code, deduplicated so an
 * owner shared by several requests is only read once. An owner whose code
 * read did not complete maps to undefined, never to "a plain wallet".
 */
const resolveOwnerCode = async (
  owners: string[],
): Promise<Map<string, boolean | undefined>> => {
  const provider = getProvider(RSK_CHAIN_ID);
  const uniqueOwners = [...new Set(owners.map(owner => owner.toLowerCase()))];
  const entries = await Promise.all(
    uniqueOwners.map(async (owner): Promise<[string, boolean | undefined]> => {
      try {
        const code = await asyncCall(
          `exitDelay/ownerCode/${RSK_CHAIN_ID}/${owner}`,
          () => provider.getCode(owner),
          { ttl: EXIT_DELAY_TTL },
        );
        return [owner, code !== '0x'];
      } catch (error) {
        return [owner, undefined];
      }
    }),
  );
  return new Map(entries);
};

/**
 * Resolve the asset an escrowed amount is denominated in.
 *
 * One queue holds every asset the perimeter covers, so a bare number is
 * unreadable: 1.5 RBTC and 1.5 DOC are three orders of magnitude apart. The
 * amount is scaled by the token's OWN decimals rather than the 18 the rest of
 * the app assumes, and an asset we cannot resolve yields no amount at all — a
 * number scaled by a guess would be silently wrong by orders of magnitude,
 * which is worse than an obvious gap.
 */
const resolveAmount = (
  token: string,
  unwrapOnDelivery: boolean,
  amount: BigNumber,
): { amount?: Decimal; tokenSymbol?: string } => {
  const native = findNativeAsset(RSK_CHAIN_ID);
  const escrowed =
    token === constants.AddressZero
      ? native
      : findAssetByAddress(token, RSK_CHAIN_ID);
  if (!escrowed) {
    return {};
  }
  // The queue unwraps on the way out, so the holder receives the native asset
  // even though the wrapped one is what is escrowed.
  const delivered = unwrapOnDelivery ? native ?? escrowed : escrowed;
  return {
    amount: Decimal.from(formatUnits(amount, escrowed.decimals)),
    tokenSymbol: delivered.symbol,
  };
};

/**
 * Every exit the perimeter currently holds for the connected account, with the
 * state each one is in.
 *
 * The queues are reached through the consumers' own pointers, the same route
 * the consumer contracts take. Zero keeps its pointer separately from the
 * lending protocol's and the two are independently settable, so BOTH are
 * followed and the results unioned: a hold promised by one surface's form can
 * never be missing from the page that releases it.
 *
 * `getActive` is indexed by PARTY and an account is a party to an exit as
 * originator or owner, so this returns exits this account can execute. An exit
 * where the account is only the receiver does not appear — matching the
 * contract, where the receiver is paid but is never an executor.
 */
export const usePerimeterVault = (): PerimeterVault => {
  const { account } = useAccount();
  const protocol = useGetProtocolContract('protocol', RSK_CHAIN_ID);

  const key = `exitDelay/vault/${account}/${protocol?.address}`;

  const { value, loading } = useCacheCall<StampedVault>(
    key,
    RSK_CHAIN_ID,
    async () => {
      if (!account) {
        return { ...EMPTY, forKey: key };
      }
      if (!protocol) {
        // The contracts have not loaded yet. Nothing has been read, so nothing
        // may be stated: stamp it so the hook keeps reporting "loading".
        return { ...EMPTY, forKey: PENDING_KEY };
      }
      try {
        const consumers = [protocol.address];
        let zeroUnresolved = false;
        try {
          const { address } = await getZeroContract(
            'borrowerOperations',
            RSK_CHAIN_ID,
          );
          consumers.push(address);
        } catch (error) {
          // Zero's queue cannot be followed without its address, so whatever
          // it holds is unread; the protocol's queue is still worth listing.
          zeroUnresolved = true;
        }

        const resolved = await Promise.all(consumers.map(resolveQueues));
        const pointerUnknown =
          zeroUnresolved || resolved.some(entry => entry.unknown);
        const queueAddresses = [
          ...new Set(resolved.flatMap(entry => entry.addresses)),
        ];

        if (queueAddresses.length === 0) {
          return {
            ...EMPTY,
            unknown: pointerUnknown,
            forKey: key,
          };
        }

        const exits: PendingExit[] = [];
        const blocks: Record<string, PartyBlockStates> = {};
        const pausedByQueue: Record<string, boolean> = {};

        for (const queueAddress of queueAddresses) {
          const queue = new Contract(
            queueAddress,
            QUEUE_ABI,
            getProvider(RSK_CHAIN_ID),
          );

          const ids: string[] = [];
          let cursor = BigNumber.from(0);
          for (let page = 0; page < MAX_PAGES; page++) {
            const result = await queue.getActive(account, cursor, PAGE);
            ids.push(...result.ids.map((id: BigNumber) => id.toString()));
            cursor = result.nextCursor;
            if (cursor.isZero()) {
              break;
            }
          }

          // `getActive` is documented as best-effort over a mutating set: a
          // concurrent removal can repeat an id. Two rows sharing a React key
          // is the visible symptom; the dangerous one is executeExits([7, 7]),
          // where the second pass reverts AlreadyTerminal and takes every other
          // release in the batch with it.
          const uniqueIds = [...new Set(ids)];

          pausedByQueue[queueAddress] = await queue.securityPerimeterPaused();

          // One wave of requests rather than one round trip per id: the read
          // runs every block.
          const requests = await Promise.all(
            uniqueIds.map(id => queue.getRequest(id)),
          );

          const parties = [
            ...new Set(
              requests.flatMap(request => [
                request.originator.toLowerCase(),
                request.owner.toLowerCase(),
                request.receiver.toLowerCase(),
              ]),
            ),
          ];
          const partyStates = new Map<string, BlockState>();
          await Promise.all(
            parties.map(async party => {
              partyStates.set(party, Number(await queue.blockStateOf(party)));
            }),
          );
          const blockStateOf = (address: string): BlockState =>
            partyStates.get(address.toLowerCase()) ?? BlockState.None;

          const ownerCode = await resolveOwnerCode(
            requests.map(request => request.owner),
          );

          uniqueIds.forEach((id, index) => {
            const request = requests[index];
            exits.push({
              id,
              queueAddress,
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
              status: Number(request.status) as ExitStatus,
              unwrapOnDelivery: request.unwrapOnDelivery,
              ownerHasCode: ownerCode.get(request.owner.toLowerCase()),
            });
            blocks[id] = {
              originator: blockStateOf(request.originator),
              owner: blockStateOf(request.owner),
              receiver: blockStateOf(request.receiver),
            };
          });
        }

        // Soonest to unlock first: the row a holder is waiting on is the one
        // worth putting at the top.
        exits.sort((a, b) => a.unlockAt - b.unlockAt);

        return {
          exits,
          blocks,
          pausedByQueue,
          paused: Object.values(pausedByQueue).some(Boolean),
          unknown: pointerUnknown,
          forKey: key,
        };
      } catch (error) {
        // A timeout, a rate limit, a malformed response. Whatever it was, this
        // account's holds were not read, and the page must say so rather than
        // print a definitive negative.
        return { ...UNREADABLE, forKey: key };
      }
    },
    [protocol?.address, account],
    { ...EMPTY, forKey: PENDING_KEY },
    { ttl: EXIT_DELAY_TTL },
  );

  return useMemo(() => {
    // A value stamped for another key belongs to the previous account, or to
    // no fetch at all — the seeded default the cache hands back before the
    // first attempt resolves. Either way nothing has been read yet, and the
    // page shows its loader instead of "not holding any withdrawals".
    const fresh = value.forKey === key;
    if (!fresh) {
      return { ...EMPTY, loading: true };
    }
    const { forKey, ...vault } = value;
    return { ...vault, loading };
  }, [value, loading, key]);
};
