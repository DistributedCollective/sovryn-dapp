import { renderHook, waitFor } from '@testing-library/react';

import { getExitDelayDisplay } from '../../utils/exitDelay';
import { useExitDelayQuote } from './useExitDelayQuote';

/**
 * The delay fails CLOSED, which is the opposite of the fee.
 *
 * When a controller is pinned and its quote cannot be read, the consumer's
 * `safeQuoteDelay` reverts the whole withdrawal; when it can, the money is
 * escrowed. So a read this hook could not complete has no honest rendering as
 * "paid straight out" — it must reach the form as `unknown`. Zero is the truth
 * only where the perimeter is unwired, and these tests hold those two apart by
 * driving each failure shape separately.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const QUEUE = '0x1111111111111111111111111111111111111111';
const CONTROLLER = '0x99994b4522483DE17F31a5bC010c5901AdD3440E';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const SURFACE =
  '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe';
const SUB_PRODUCT = '0x0000000000000000000000000000000000000123';

const mockQueuePointer = jest.fn();
const mockControllerPointer = jest.fn();
const mockQuote = jest.fn();

/** A reverted call: the shape ethers reports for a function that is not there. */
const callRevert = () =>
  Object.assign(new Error('call revert exception'), {
    code: 'CALL_EXCEPTION',
  });

/** An unreachable node: carries no information about what is deployed. */
const networkError = () =>
  Object.assign(new Error('missing response'), { code: 'SERVER_ERROR' });

// create-react-app's jest preset sets `resetMocks: true`, so these factories
// must delegate to jest.fn()s wired up per test rather than carry an
// implementation of their own.
jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function (_address: string, abi: string[]) {
      const source = JSON.stringify(abi);
      if (source.includes('exitDelayQueue')) {
        return { exitDelayQueue: () => mockQueuePointer() };
      }
      if (source.includes('exitFeeController')) {
        return { exitFeeController: () => mockControllerPointer() };
      }
      return {
        quoteExitDelayFor: (...args: unknown[]) => mockQuote(...args),
      };
    },
  };
});

jest.mock('@sovryn/ethers-provider', () => ({
  getProvider: () => ({}),
}));

jest.mock('../../config/chains', () => ({
  RSK_CHAIN_ID: '0x1e',
}));

jest.mock('../../store/rxjs/provider-cache', () => ({
  asyncCall: (_key: string, fn: () => unknown) => fn(),
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT }),
}));

jest.mock('../useGetContract', () => ({
  useGetProtocolContract: () => ({ address: PROTOCOL }),
}));

// Stand-in for the shared cache: runs the fetcher once and reports the result,
// so these tests measure the hook's own classification and nothing else.
jest.mock('../useCacheCall', () => {
  const React = jest.requireActual('react');
  return {
    useCacheCall: (
      _key: string,
      _chainId: string,
      fn: () => Promise<unknown>,
      _deps: unknown[],
      defaultValue: unknown,
    ) => {
      const [state, setState] = React.useState({
        value: defaultValue,
        loading: true,
      });
      React.useEffect(() => {
        let alive = true;
        Promise.resolve(fn()).then((value: unknown) => {
          if (alive) setState({ value, loading: false });
        });
        return () => {
          alive = false;
        };
      }, []);
      return state;
    },
  };
});

const render = () => renderHook(() => useExitDelayQuote(SURFACE, SUB_PRODUCT));

describe('useExitDelayQuote', () => {
  beforeEach(() => {
    mockQueuePointer.mockResolvedValue(QUEUE);
    mockControllerPointer.mockResolvedValue(CONTROLLER);
  });

  it('reports the hold the controller quoted', async () => {
    mockQuote.mockResolvedValue({ d: 172800 });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.delaySeconds).toBe(172800);
    expect(result.current.unknown).toBe(false);
    expect(getExitDelayDisplay(result.current)).toBe('held');
  });

  it('quotes the account as all three identities, matching the exit', async () => {
    mockQuote.mockResolvedValue({ d: 0 });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockQuote).toHaveBeenCalledWith(
      ACCOUNT,
      ACCOUNT,
      ACCOUNT,
      SURFACE,
      SUB_PRODUCT,
    );
  });

  it('reports no hold when the controller quotes zero', async () => {
    mockQuote.mockResolvedValue({ d: 0 });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    // Prove we got here by classifying an answer, not by failing early.
    expect(mockQuote).toHaveBeenCalled();
    expect(result.current.unknown).toBe(false);
    expect(getExitDelayDisplay(result.current)).toBe('none');
  });

  it('reports unknown, never zero, when the quote cannot be read', async () => {
    // The pinned controller could not be quoted. On chain that same failure
    // reverts the withdrawal; rendering it as "no hold" would promise the user
    // a payout that either does not arrive or does not happen.
    mockQuote.mockRejectedValue(networkError());

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
    expect(getExitDelayDisplay(result.current)).toBe('unknown');
  });

  it('reports unknown when a pinned controller reverts the quote', async () => {
    mockQuote.mockRejectedValue(callRevert());

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
  });

  it('reports unknown when the queue pointer cannot be reached', async () => {
    mockQueuePointer.mockRejectedValue(networkError());

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
  });

  it('reports no hold on a consumer with no queue leg, without quoting', async () => {
    // A reverting `exitDelayQueue()` is the pre-perimeter consumer: it has
    // nothing to escrow with, so the global delay must not be announced for it.
    mockQueuePointer.mockRejectedValue(callRevert());
    mockQuote.mockResolvedValue({ d: 172800 });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(false);
    expect(getExitDelayDisplay(result.current)).toBe('none');
    expect(mockQuote).not.toHaveBeenCalled();
  });

  it('reports no hold when the queue pointer is unset, without quoting', async () => {
    mockQueuePointer.mockResolvedValue(ZERO_ADDRESS);
    mockQuote.mockResolvedValue({ d: 172800 });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getExitDelayDisplay(result.current)).toBe('none');
    expect(mockQuote).not.toHaveBeenCalled();
  });

  it('reports no hold when no controller is pinned', async () => {
    mockControllerPointer.mockResolvedValue(ZERO_ADDRESS);

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(false);
    expect(mockQuote).not.toHaveBeenCalled();
  });

  it('shows nothing while the quote has not arrived', () => {
    mockQuote.mockReturnValue(new Promise(() => undefined));

    const { result } = render();

    expect(result.current.loading).toBe(true);
    expect(getExitDelayDisplay(result.current)).toBe('none');
  });
});
