import { renderHook, waitFor } from '@testing-library/react';

import { BigNumber, constants } from 'ethers';

import { Decimal } from '@sovryn/utils';

import { SURFACE_ZERO_CLAIM_SURPLUS } from '../../utils/exitFee';
import {
  JsonRpcStub,
  captureCallFailure,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { useZeroClaimExitFee } from './useZeroClaimExitFee';

/**
 * The surplus claim is charged by Zero's BorrowerOperations, which keeps its
 * own controller pointer, independently settable from the lending protocol's.
 * So the claim's fee is quoted through that pointer, for the claim surface and
 * the actual surplus: the fee and net shown are the controller's own figures
 * for this claim. The fee fails OPEN on chain, so every answer but a charged
 * quote hides the rows; the hook still reports "no fee" apart from "not read".
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
const CONTROLLER = '0x99994b4522483DE17F31a5bC010c5901AdD3440E';
const FEE_RECEIVER = '0xDDE75f75ff33Aa802f2316cCAe2bE77823fc6f9B';
const SURPLUS_WEI = '400000000000000000';

const mockReadPointer = jest.fn();
const mockQuoteExitFee = jest.fn();
const mockZeroContract = jest.fn();

jest.mock('../exitDelay/readPerimeterPointer', () => ({
  readPerimeterPointer: (...args: unknown[]) => mockReadPointer(...args),
}));

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function (address: string) {
      return {
        quoteExitFee: (...args: unknown[]) =>
          mockQuoteExitFee(address, ...args),
      };
    },
  };
});

jest.mock('@sovryn/contracts', () => ({
  getZeroContract: (...args: unknown[]) => mockZeroContract(...args),
}));

jest.mock('@sovryn/ethers-provider', () => ({
  getProvider: () => ({}),
}));

jest.mock('../../utils/chain', () => ({
  getRskChainId: () => '0x1e',
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT }),
}));

// Short enough that the deadline test below does not wait ten real seconds.
jest.mock('../exitDelay/useExitDelay', () => ({
  ...jest.requireActual('../exitDelay/useExitDelay'),
  EXIT_DELAY_QUOTE_TIMEOUT_MS: 50,
}));

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
        // Idle at first, as the shared cache is: a result still to come must
        // be reported by the hook under test, not by this stand-in.
        loading: false,
      });
      // Holds the latest fn without making the mount effect below re-run:
      // fn's identity changes every render, but this mock fetches once.
      const fnRef = React.useRef(fn);
      fnRef.current = fn;
      React.useEffect(() => {
        let alive = true;
        Promise.resolve(fnRef.current()).then((value: unknown) => {
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

/** A controller quote in the contract's own shape. */
const quote = (overrides: Record<string, unknown> = {}) => ({
  active: true,
  rateBps: 10,
  feeAmount: BigNumber.from('400000000000000'),
  netAmount: BigNumber.from('399600000000000000'),
  feeReceiver: FEE_RECEIVER,
  reason: 0,
  ...overrides,
});

const SURPLUS = Decimal.from('0.4');

const settled = async (gross: Decimal = SURPLUS) => {
  const hook = renderHook(() => useZeroClaimExitFee(gross));
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook.result;
};

describe('useZeroClaimExitFee', () => {
  let stub: JsonRpcStub;
  let transportFailure: unknown;

  beforeAll(async () => {
    stub = await startJsonRpcStub();
    transportFailure = await captureCallFailure(stub, {
      status: 503,
      body: 'unavailable',
    });
  });

  afterAll(() => stub.close());

  beforeEach(() => {
    mockZeroContract.mockResolvedValue({ address: BORROWER_OPERATIONS });
    mockReadPointer.mockResolvedValue({ kind: 'address', address: CONTROLLER });
    mockQuoteExitFee.mockResolvedValue(quote());
  });

  it("quotes the claim through BorrowerOperations' own controller pointer, for the actual surplus", async () => {
    const result = await settled();

    expect(mockReadPointer).toHaveBeenCalledWith(
      '0x1e',
      BORROWER_OPERATIONS,
      'exitFeeController',
    );
    expect(mockQuoteExitFee).toHaveBeenCalledWith(
      CONTROLLER,
      SURFACE_ZERO_CLAIM_SURPLUS,
      constants.AddressZero,
      ACCOUNT,
      SURPLUS_WEI,
    );
    expect(result.current.active).toBe(true);
    expect(result.current.rateBps).toBe(10);
    expect(result.current.feeAmount.toString()).toBe('0.0004');
    expect(result.current.netAmount.toString()).toBe('0.3996');
    expect(result.current.unknown).toBe(false);
  });

  it('reports a stated "no fee" when BorrowerOperations has no controller getter', async () => {
    mockReadPointer.mockResolvedValue({ kind: 'absent' });

    const result = await settled();

    expect(result.current.active).toBe(false);
    expect(result.current.unknown).toBe(false);
    expect(mockQuoteExitFee).not.toHaveBeenCalled();
  });

  it('reports a stated "no fee" when no controller is pinned', async () => {
    mockReadPointer.mockResolvedValue({
      kind: 'address',
      address: constants.AddressZero,
    });

    const result = await settled();

    expect(result.current.active).toBe(false);
    expect(result.current.unknown).toBe(false);
    expect(mockQuoteExitFee).not.toHaveBeenCalled();
  });

  it('reports unknown when the controller pointer could not be read', async () => {
    mockReadPointer.mockResolvedValue({ kind: 'unreadable' });

    const result = await settled();

    expect(result.current.unknown).toBe(true);
    expect(mockQuoteExitFee).not.toHaveBeenCalled();
  });

  it('reports unknown when the quote could not be read', async () => {
    mockQuoteExitFee.mockRejectedValue(transportFailure);

    const result = await settled();

    expect(result.current.active).toBe(false);
    expect(result.current.unknown).toBe(true);
  });

  it('reports unknown when BorrowerOperations cannot be resolved', async () => {
    mockZeroContract.mockRejectedValue(new Error('no artifact'));

    const result = await settled();

    expect(result.current.unknown).toBe(true);
    expect(mockReadPointer).not.toHaveBeenCalled();
  });

  it('hides a quote whose net is not the surplus less the fee', async () => {
    // The chain re-derives net from gross and fee and charges nothing when
    // they disagree; a net it will not pay is not one to print.
    mockQuoteExitFee.mockResolvedValue(
      quote({ netAmount: BigNumber.from('390000000000000000') }),
    );

    const result = await settled();

    expect(result.current.active).toBe(false);
  });

  it('quotes nothing for a zero surplus', async () => {
    const result = await settled(Decimal.ZERO);

    expect(result.current.active).toBe(false);
    expect(mockQuoteExitFee).not.toHaveBeenCalled();
  });

  it('reports unknown, not still loading, once its deadline passes without an answer', async () => {
    mockQuoteExitFee.mockReturnValue(new Promise(() => undefined)); // never settles

    const result = await settled();

    expect(result.current.unknown).toBe(true);
    expect(result.current.active).toBe(false);
  });
});
