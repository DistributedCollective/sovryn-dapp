import { providers, utils } from 'ethers';

import { ChainId, getProvider } from '@sovryn/ethers-provider';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { EXIT_DELAY_TTL } from '../../utils/exitDelay';

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

type JsonRpcSender = {
  send: (method: string, params: unknown[]) => Promise<unknown>;
};

const canSend = (value: unknown): value is JsonRpcSender =>
  typeof (value as JsonRpcSender | undefined)?.send === 'function';

/**
 * The JSON-RPC backends behind a provider, in the order it lists them: the
 * provider itself when it speaks JSON-RPC, or the backends of the app's
 * fallback provider, which does not.
 */
const sendersOf = (provider: providers.Provider): JsonRpcSender[] => {
  if (canSend(provider)) {
    return [provider];
  }
  const configs = (
    provider as { providerConfigs?: ReadonlyArray<{ provider?: unknown }> }
  ).providerConfigs;
  if (!Array.isArray(configs)) {
    return [];
  }
  return configs.map(config => config.provider).filter(canSend);
};

type NodeError = { code: number; message: string };

/**
 * The error object the node itself returned, if the failure carries one.
 *
 * Ethers' `getResult` turns a JSON-RPC error response into an Error holding
 * the node's numeric `code` and `message`, and `fetchJson` nests it as `error`
 * of a "processing response error", which it raises only after an HTTP 2xx. A
 * timeout, an HTTP error status, a dropped connection or a body that is not
 * JSON never carries one: their codes are ethers' own strings.
 */
const nodeErrorOf = (error: unknown): NodeError | undefined => {
  let current = error as { code?: unknown; message?: unknown; error?: unknown };
  for (let depth = 0; current && depth < 3; depth++) {
    if (
      typeof current.code === 'number' &&
      typeof current.message === 'string'
    ) {
      return current as NodeError;
    }
    current = current.error as typeof current;
  }
  return undefined;
};

/** Matches "revert target not active", "transaction reverted", "execution reverted". */
const REVERTED = /\brevert(ed)?\b/i;

/**
 * Whether the node executed the call and the EVM reverted it. A rate limit or
 * an upstream failure reported as a JSON-RPC error is not a revert.
 */
export const isNodeRevert = (error: unknown): boolean => {
  const nodeError = nodeErrorOf(error);
  return !!nodeError && REVERTED.test(nodeError.message);
};

const decodeAddress = (result: unknown): string | undefined => {
  if (
    typeof result !== 'string' ||
    !utils.isHexString(result) ||
    utils.hexDataLength(result) !== 32
  ) {
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
 * The call is sent to the provider's JSON-RPC backends as a raw `eth_call`
 * rather than through `provider.call`. On that path ethers reports a revert
 * and a transport failure with the same CALL_EXCEPTION, the app's fallback
 * provider drops the nested error that would tell them apart, and a revert
 * whose message says "reverted" with empty data comes back as a successful
 * `0x`. Here the node's own answer decides:
 *
 * - a 32-byte result is the pointer, the zero address included;
 * - a JSON-RPC error saying the call reverted is `absent`;
 * - anything else, from every backend, is `unreadable`.
 */
export const readAddressGetter = async (
  provider: providers.Provider,
  contractAddress: string,
  getter: PointerGetter,
): Promise<PointerRead> => {
  const data = GETTERS.encodeFunctionData(getter);
  for (const sender of sendersOf(provider)) {
    try {
      const address = decodeAddress(
        await sender.send('eth_call', [
          { to: contractAddress, data },
          'latest',
        ]),
      );
      if (address) {
        return { kind: 'address', address };
      }
    } catch (error) {
      if (isNodeRevert(error)) {
        return { kind: 'absent' };
      }
    }
  }
  return UNREADABLE_POINTER;
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
        readAddressGetter(getProvider(chainId), consumerAddress, getter),
      { ttl: EXIT_DELAY_TTL },
    );
  } catch (error) {
    return UNREADABLE_POINTER;
  }
};
