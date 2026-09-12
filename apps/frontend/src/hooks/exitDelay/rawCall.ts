import { providers, utils } from 'ethers';

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

type NodeError = { code: number; message: string; data?: unknown };

/**
 * The error object the node itself returned, if the failure carries one.
 *
 * Ethers' `getResult` turns a JSON-RPC error response into an Error holding
 * the node's numeric `code`, `message` and `data`, and `fetchJson` nests it as
 * `error` of a "processing response error", which it raises only after an
 * HTTP 2xx. A timeout, an HTTP error status, a dropped connection or a body
 * that is not JSON never carries one: their codes are ethers' own strings.
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

/**
 * Matches "revert target not active", "transaction reverted" and "execution
 * reverted". A rate limit or an upstream failure reported as a JSON-RPC error
 * does not match, and is not a revert.
 */
const REVERTED = /\brevert(ed)?\b/i;

export type RawCallOutcome =
  /** The node executed the call, and it returned this data. */
  | { kind: 'result'; data: string }
  /** The node executed the call, and it reverted with this data if it gave any. */
  | { kind: 'reverted'; data?: string }
  /** No backend answered. */
  | { kind: 'unreadable' };

export type RawCall = { to: string; data: string; from?: string };

/**
 * Send `eth_call` straight to the provider's JSON-RPC backends and report the
 * node's own answer.
 *
 * On the app's ordinary call path ethers reports a revert and a transport
 * failure with the same CALL_EXCEPTION, the app's fallback provider drops the
 * nested node error and its revert data, and a revert whose message says
 * "reverted" with hex data comes back as a successful result. Here a revert is
 * recognised from the node's error object and keeps its data, so a caller can
 * both tell "the chain said no" from "no answer" and say why.
 *
 * A backend that does not answer, or whose result `isAnswer` rejects, is
 * skipped for the next one; when none answers the call is unreadable.
 */
export const callRaw = async (
  provider: providers.Provider,
  call: RawCall,
  isAnswer: (result: string) => boolean = () => true,
): Promise<RawCallOutcome> => {
  for (const sender of sendersOf(provider)) {
    try {
      const result = await sender.send('eth_call', [call, 'latest']);
      if (
        typeof result === 'string' &&
        utils.isHexString(result) &&
        isAnswer(result)
      ) {
        return { kind: 'result', data: result };
      }
    } catch (error) {
      const nodeError = nodeErrorOf(error);
      if (nodeError && REVERTED.test(nodeError.message)) {
        return {
          kind: 'reverted',
          data: typeof nodeError.data === 'string' ? nodeError.data : undefined,
        };
      }
    }
  }
  return { kind: 'unreadable' };
};
