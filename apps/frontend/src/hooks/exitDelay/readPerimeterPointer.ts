import { providers, utils } from 'ethers';

import { ChainId, getProvider } from '@sovryn/ethers-provider';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { EXIT_DELAY_TTL, RELEASE_READ_TIMEOUT_MS } from '../../utils/exitDelay';
import { callRaw } from './rawCall';

export type PointerGetter = 'exitDelayQueue' | 'exitFeeController';

/**
 * One read of a consumer's perimeter pointer.
 *
 * `absent` is a positive answer: the node executed the getter and it reverted,
 * so the consumer has no such pointer. `unreadable` is no answer at all, and
 * must never be treated as `absent`.
 */
export type PointerRead =
  /** The getter's value. The zero address means the pointer is unset. */
  | { kind: 'address'; address: string }
  | { kind: 'absent' }
  | { kind: 'unreadable' };

export const UNREADABLE_POINTER: PointerRead = { kind: 'unreadable' };

const GETTERS = new utils.Interface([
  'function exitDelayQueue() view returns (address)',
  'function exitFeeController() view returns (address)',
]);

const decodeAddress = (result: string): string | undefined => {
  if (utils.hexDataLength(result) !== 32) {
    return undefined;
  }
  try {
    return utils.defaultAbiCoder.decode(['address'], result)[0];
  } catch (error) {
    return undefined;
  }
};

/**
 * Read one of a consumer's perimeter pointers, telling a getter the consumer
 * does not have apart from a node that could not be reached.
 *
 * The node's own answer decides, through `callRaw`:
 *
 * - a 32-byte result is the pointer, the zero address included;
 * - a call the node reports as reverted is `absent`;
 * - anything else, from every backend, is `unreadable` — including a backend
 *   that does not answer at all within `timeoutMs`.
 */
export const readAddressGetter = async (
  provider: providers.Provider,
  contractAddress: string,
  getter: PointerGetter,
  timeoutMs: number,
): Promise<PointerRead> => {
  const outcome = await callRaw(
    provider,
    { to: contractAddress, data: GETTERS.encodeFunctionData(getter) },
    result => decodeAddress(result) !== undefined,
    timeoutMs,
  );
  if (outcome.kind === 'result') {
    const address = decodeAddress(outcome.data);
    return address ? { kind: 'address', address } : UNREADABLE_POINTER;
  }
  return outcome.kind === 'reverted' ? { kind: 'absent' } : UNREADABLE_POINTER;
};

/**
 * `readAddressGetter` through the shared cache, keyed by chain, consumer and
 * getter, so every hook reading the same pointer shares one round trip and
 * one classification. Never throws.
 */
export const readPerimeterPointer = async (
  chainId: ChainId,
  consumerAddress: string,
  getter: PointerGetter,
): Promise<PointerRead> => {
  try {
    return await asyncCall(
      `perimeter/pointer/${chainId}/${consumerAddress.toLowerCase()}/${getter}`,
      async () =>
        readAddressGetter(
          getProvider(chainId),
          consumerAddress,
          getter,
          RELEASE_READ_TIMEOUT_MS,
        ),
      { ttl: EXIT_DELAY_TTL },
    );
  } catch (error) {
    return UNREADABLE_POINTER;
  }
};
