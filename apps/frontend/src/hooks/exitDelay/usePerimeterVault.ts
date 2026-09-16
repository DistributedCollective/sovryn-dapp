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
  PendingExit,
  RELEASE_READ_TIMEOUT_MS,
  isStatedExitStatus,
} from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { useGetProtocolContract } from '../useGetContract';
import { boundedBy } from './rawCall';
import { readPerimeterPointer } from './readPerimeterPointer';
import { EXIT_DELAY_QUOTE_TIMEOUT_MS, useDeadlinePassed } from './useExitDelay';

/**
 * What the vault page lists. Every party's block state is read alongside the
 * request itself, so a frozen or blacklisted hold reads that way from the
 * list rather than only at the press. A block state that could not be read
 * marks the whole vault unknown, the same as any other failed read here.
 */
export type PerimeterVault = {
  exits: PendingExit[];
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
  'function securityPerimeterPaused() view returns (bool)',
  'function blockStateOf(address a) view returns (uint8)',
];

/** Whether a raw `blockStateOf` answer is one of the values the queue defines. */
const isKnownBlockState = (state: number): state is BlockState =>
  state === BlockState.None ||
  state === BlockState.Frozen ||
  state === BlockState.Blacklisted;

/**
 * The block state of each given address, deduplicated. An address whose read
 * did not complete, or whose answer is outside the known values, maps to
 * undefined, never to "clear", and marks the result unknown.
 */
const resolveBlockStates = async (
  queue: Contract,
  addresses: string[],
): Promise<{
  states: Map<string, BlockState | undefined>;
  unknown: boolean;
}> => {
  const unique = [...new Set(addresses.map(a => a.toLowerCase()))];
  let unknown = false;
  const entries = await Promise.all(
    unique.map(async (address): Promise<[string, BlockState | undefined]> => {
      try {
        const raw = Number(
          await boundedBy(queue.blockStateOf(address), RELEASE_READ_TIMEOUT_MS),
        );
        if (!isKnownBlockState(raw)) {
          unknown = true;
          return [address, undefined];
        }
        return [address, raw];
      } catch (error) {
        unknown = true;
        return [address, undefined];
      }
    }),
  );
  return { states: new Map(entries), unknown };
};

/**
 * A frozen party wins over a blacklisted one. When neither is stated and at
 * least one party's own read did not complete, the row is unreadable rather
 * than silently counted as clear.
 */
const blockedStateOf = (
  parties: string[],
  states: Map<string, BlockState | undefined>,
): { state: BlockState | undefined; unreadable: boolean } => {
  const read = parties.map(party => states.get(party.toLowerCase()));
  if (read.includes(BlockState.Frozen)) {
    return { state: BlockState.Frozen, unreadable: false };
  }
  if (read.includes(BlockState.Blacklisted)) {
    return { state: BlockState.Blacklisted, unreadable: false };
  }
  return {
    state: undefined,
    unreadable: read.some(state => state === undefined),
  };
};

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
 * read did not complete maps to undefined, never to "a plain wallet", and
 * marks the result unknown, the same as the vault's other reads.
 */
const resolveOwnerCode = async (
  owners: string[],
): Promise<{
  codes: Map<string, boolean | undefined>;
  unknown: boolean;
}> => {
  const provider = getProvider(RSK_CHAIN_ID);
  const uniqueOwners = [...new Set(owners.map(owner => owner.toLowerCase()))];
  let unknown = false;
  const entries = await Promise.all(
    uniqueOwners.map(async (owner): Promise<[string, boolean | undefined]> => {
      try {
        const code = await asyncCall(
          `exitDelay/ownerCode/${RSK_CHAIN_ID}/${owner}`,
          () => boundedBy(provider.getCode(owner), RELEASE_READ_TIMEOUT_MS),
          { ttl: EXIT_DELAY_TTL },
        );
        return [owner, code !== '0x'];
      } catch (error) {
        unknown = true;
        return [owner, undefined];
      }
    }),
  );
  return { codes: new Map(entries), unknown };
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
export const resolveAmount = (
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
        const pausedByQueue: Record<string, boolean> = {};
        let blockStateUnknown = false;
        let requestStatusUnknown = false;
        let ownerCodeUnknown = false;

        for (const queueAddress of queueAddresses) {
          const queue = new Contract(
            queueAddress,
            QUEUE_ABI,
            getProvider(RSK_CHAIN_ID),
          );

          const ids: string[] = [];
          let cursor = BigNumber.from(0);
          for (let page = 0; page < MAX_PAGES; page++) {
            const result = await boundedBy(
              queue.getActive(account, cursor, PAGE),
              RELEASE_READ_TIMEOUT_MS,
            );
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

          pausedByQueue[queueAddress] = await boundedBy(
            queue.securityPerimeterPaused(),
            RELEASE_READ_TIMEOUT_MS,
          );

          // One wave of requests rather than one round trip per id: the read
          // runs every block.
          const requests = await Promise.all(
            uniqueIds.map(id =>
              boundedBy(queue.getRequest(id), RELEASE_READ_TIMEOUT_MS),
            ),
          );

          const { codes: ownerCode, unknown: theseOwnerCodesUnknown } =
            await resolveOwnerCode(requests.map(request => request.owner));
          ownerCodeUnknown = ownerCodeUnknown || theseOwnerCodesUnknown;
          const { states: blockStates, unknown: theseBlockStatesUnknown } =
            await resolveBlockStates(
              queue,
              requests.flatMap(request => [
                request.originator,
                request.owner,
                request.receiver,
              ]),
            );
          blockStateUnknown = blockStateUnknown || theseBlockStatesUnknown;

          // The zero value means the queue holds no such request at all, and
          // a value outside the five it defines is no more stated than that
          // — either way the row is kept and the vault marked unknown, the
          // same as any other read that did not complete, rather than shown
          // as whatever the fallback status would make of it.
          const theseStatusesUnknown = requests.some(
            request => !isStatedExitStatus(Number(request.status)),
          );
          requestStatusUnknown = requestStatusUnknown || theseStatusesUnknown;

          uniqueIds.forEach((id, index) => {
            const request = requests[index];
            const blocked = blockedStateOf(
              [request.originator, request.owner, request.receiver],
              blockStates,
            );
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
              blockedState: blocked.state,
              blockedStateUnreadable: blocked.unreadable,
            });
          });
        }

        // Soonest to unlock first: the row a holder is waiting on is the one
        // worth putting at the top.
        exits.sort((a, b) => a.unlockAt - b.unlockAt);

        return {
          exits,
          pausedByQueue,
          paused: Object.values(pausedByQueue).some(Boolean),
          unknown:
            pointerUnknown ||
            blockStateUnknown ||
            requestStatusUnknown ||
            ownerCodeUnknown,
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

  // A value stamped for another key belongs to the previous account, or to no
  // fetch at all — the seeded default the cache hands back before the first
  // attempt resolves, including one that never starts because the shared
  // cache is still waiting on a block number. Past this deadline a value
  // still not fresh is reported unknown rather than left loading for ever.
  const fresh = value.forKey === key;
  const deadlinePassed = useDeadlinePassed(
    key,
    fresh,
    EXIT_DELAY_QUOTE_TIMEOUT_MS,
  );

  return useMemo(() => {
    if (!fresh) {
      return deadlinePassed
        ? { ...UNREADABLE, loading: false }
        : { ...EMPTY, loading: true };
    }
    const { forKey, ...vault } = value;
    return { ...vault, loading };
  }, [value, loading, fresh, deadlinePassed]);
};
