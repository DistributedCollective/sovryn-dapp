import { providers, utils } from 'ethers';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { AddressInfo, Socket } from 'net';

/**
 * A local JSON-RPC node for tests.
 *
 * It lets a test drive the app's real provider stack — ethers' HTTP transport,
 * its error wrapping, and the app's own fallback provider — against the exact
 * answers a node gives, instead of against error objects written by hand. The
 * server listens on an ephemeral port chosen by the operating system, which is
 * always above 8547, and `close` must be called when the test file finishes.
 */

export type StubAnswer =
  /** A successful JSON-RPC response carrying this result. */
  | { result: unknown }
  /** A JSON-RPC error object inside an HTTP 200 response. */
  | { error: { code: number; message: string; data?: string } }
  /** An HTTP response with this status and body, not JSON-RPC at all. */
  | { status: number; body: string }
  /** HTTP 200 with this body verbatim, whether or not it parses. */
  | { raw: string }
  /** The connection is closed without a response. */
  | { drop: true }
  /** The request is accepted and never answered. */
  | { hang: true };

type Rule = { to: string; dataPrefix: string; answer: StubAnswer };

type RecordedCall = { method: string; to?: string; data?: string };

export type JsonRpcStub = {
  url: string;
  /**
   * Answer `eth_call` to `to` whose calldata starts with `dataPrefix`. When
   * several rules match, the longest prefix wins, so a rule for one exact
   * argument can sit beside a rule for the whole function.
   */
  onCall: (to: string, dataPrefix: string, answer: StubAnswer) => void;
  /** Answer every request for a method other than `eth_call`. */
  onMethod: (method: string, answer: StubAnswer) => void;
  /** How many `eth_call`s reached `to`, optionally only those starting with `dataPrefix`. */
  callCount: (to: string, dataPrefix?: string) => number;
  /** Forget every rule and recorded call; the default chain answers remain. */
  reset: () => void;
  close: () => Promise<void>;
};

const RSK_MAINNET_CHAIN_ID = '0x1e';

const defaultMethods = (): Record<string, StubAnswer> => ({
  eth_chainId: { result: RSK_MAINNET_CHAIN_ID },
  net_version: { result: '30' },
  eth_blockNumber: { result: '0x10' },
});

/** Revert data for `Error(string)`, encoded the way Solidity encodes a reason. */
export const revertReasonData = (reason: string): string =>
  utils.hexConcat([
    utils.id('Error(string)').slice(0, 10),
    utils.defaultAbiCoder.encode(['string'], [reason]),
  ]);

/**
 * The RSK node's answer to `exitDelayQueue()` on the lending protocol proxy,
 * which routes that selector to no module: code -32015 and an `Error(string)`
 * payload.
 */
export const RSK_PROTOCOL_TARGET_NOT_ACTIVE: StubAnswer = {
  error: {
    code: -32015,
    message:
      'VM Exception while processing transaction: revert target not active',
    data: revertReasonData('target not active'),
  },
};

/** The RSK node's answer to `exitDelayQueue()` on a loan token proxy with no such module. */
export const RSK_LOAN_TOKEN_TARGET_NOT_ACTIVE: StubAnswer = {
  error: {
    code: -32015,
    message:
      'VM Exception while processing transaction: revert LoanTokenLogicProxy:target not active',
    data: revertReasonData('LoanTokenLogicProxy:target not active'),
  },
};

/**
 * The RSK node's answer to `exitDelayQueue()` on Zero's BorrowerOperations,
 * whose implementation has no such function: code -32015 and empty revert
 * data. Ethers turns this one into a successful `0x` result on its own call
 * path, because the message contains "reverted" and `0x` is valid hex.
 */
export const RSK_REVERT_WITHOUT_DATA: StubAnswer = {
  error: {
    code: -32015,
    message: 'VM Exception while processing transaction: transaction reverted',
    data: '0x',
  },
};

/** An ABI-encoded address result. */
export const addressResult = (address: string): StubAnswer => ({
  result: utils.defaultAbiCoder.encode(['address'], [address]),
});

export const selectorOf = (signature: string): string =>
  utils.id(signature).slice(0, 10);

/**
 * The error the installed ethers raises for a read that meets `answer`, taken
 * from a real `provider.call` against the stub rather than written by hand.
 */
export const captureCallFailure = async (
  stub: JsonRpcStub,
  answer: StubAnswer,
): Promise<unknown> => {
  const target = '0x000000000000000000000000000000000000dead';
  stub.onCall(target, '0x', answer);
  try {
    await new providers.StaticJsonRpcProvider(stub.url).call({
      to: target,
      data: '0x12345678',
    });
  } catch (error) {
    return error;
  }
  throw new Error('the stubbed call succeeded');
};

const readBody = (request: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', chunk => (body += chunk));
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });

export const startJsonRpcStub = async (): Promise<JsonRpcStub> => {
  let rules: Rule[] = [];
  let methods = defaultMethods();
  let calls: RecordedCall[] = [];
  const sockets = new Set<Socket>();

  const answerFor = (method: string, params: unknown[]): StubAnswer => {
    if (method !== 'eth_call') {
      return (
        methods[method] ?? {
          error: { code: -32601, message: `stub: no answer for ${method}` },
        }
      );
    }
    const [tx] = params as [{ to?: string; data?: string }];
    const to = (tx?.to ?? '').toLowerCase();
    const data = (tx?.data ?? '').toLowerCase();
    calls.push({ method, to, data });
    const match = rules
      .filter(rule => rule.to === to && data.startsWith(rule.dataPrefix))
      .sort((a, b) => b.dataPrefix.length - a.dataPrefix.length)[0];
    return (
      match?.answer ?? {
        error: { code: -32601, message: 'stub: no answer for this call' },
      }
    );
  };

  const server = createServer(
    async (request: IncomingMessage, response: ServerResponse) => {
      const body = await readBody(request);
      let payload: { id?: unknown; method?: string; params?: unknown[] };
      try {
        payload = JSON.parse(body);
      } catch (error) {
        response.writeHead(400);
        response.end('bad request');
        return;
      }
      const answer = answerFor(payload.method ?? '', payload.params ?? []);

      if ('hang' in answer) {
        return;
      }
      if ('drop' in answer) {
        request.socket.destroy();
        return;
      }
      if ('status' in answer) {
        response.writeHead(answer.status, { 'content-type': 'text/html' });
        response.end(answer.body);
        return;
      }
      response.writeHead(200, { 'content-type': 'application/json' });
      if ('raw' in answer) {
        response.end(answer.raw);
        return;
      }
      response.end(
        JSON.stringify({
          jsonrpc: '2.0',
          id: payload.id,
          ...('result' in answer
            ? { result: answer.result }
            : { error: answer.error }),
        }),
      );
    },
  );

  server.on('connection', socket => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}`,
    onCall: (to, dataPrefix, answer) =>
      rules.push({
        to: to.toLowerCase(),
        dataPrefix: dataPrefix.toLowerCase(),
        answer,
      }),
    onMethod: (method, answer) => {
      methods[method] = answer;
    },
    callCount: (to, dataPrefix = '') =>
      calls.filter(
        call =>
          call.to === to.toLowerCase() &&
          (call.data ?? '').startsWith(dataPrefix.toLowerCase()),
      ).length,
    reset: () => {
      rules = [];
      methods = defaultMethods();
      calls = [];
    },
    close: () =>
      new Promise<void>(resolve => {
        sockets.forEach(socket => socket.destroy());
        server.close(() => resolve());
      }),
  };
};
