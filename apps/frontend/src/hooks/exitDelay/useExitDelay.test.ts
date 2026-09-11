import { renderHook, waitFor } from '@testing-library/react';

import { ChainId } from '@sovryn/ethers-provider';

import { getExitDelayDisplay } from '../../utils/exitDelay';
import { ExitDelayRequest, useExitDelay } from './useExitDelay';

/**
 * These tests run the hook on the app's real shared cache, which starts every
 * value at its default with `loading: false` and does not fetch at all until a
 * block number is known. A quote that has not arrived for exactly the question
 * being asked is reported as loading, and a bounded wait turns it into
 * "could not read" rather than leaving the form waiting.
 */

const RSK: ChainId = '0x1e' as ChainId;
/** A chain whose block number never arrives, so the cache never fetches. */
const STALLED: ChainId = '0x98' as ChainId;
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const SURFACE =
  '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe';
const SUB_PRODUCT = '0x0000000000000000000000000000000000000123';
const OTHER_SUB_PRODUCT = '0x0000000000000000000000000000000000000456';

const mockQuoteExitDelay = jest.fn();
const mockBlockNumber = jest.fn();

jest.mock('./quoteExitDelay', () => ({
  quoteExitDelay: (...args: unknown[]) => mockQuoteExitDelay(...args),
}));

// The real chain configuration loads through the shared cache and calls this
// package's default export; spreading the module drops its non-enumerable
// `__esModule` flag, so it is restored for the default import to resolve.
jest.mock('@sovryn/ethers-provider', () => ({
  __esModule: true,
  ...jest.requireActual('@sovryn/ethers-provider'),
  getProvider: (chainId: string) => ({
    getBlockNumber: () => mockBlockNumber(chainId),
  }),
}));

// The shared cache is module-global, so every test asks for its own account
// and no answer from one test is fresh for another. A request is built once
// per test and passed to every render: a new account on each render would be
// a new question on each render.
let nextAccount = 1;
const freshAccount = () =>
  `0x${(nextAccount++).toString(16).padStart(40, '0')}`;

const request = (
  overrides: Partial<ExitDelayRequest> = {},
): ExitDelayRequest => ({
  chainId: RSK,
  consumerAddress: PROTOCOL,
  surfaceId: SURFACE,
  subProduct: SUB_PRODUCT,
  account: 'account' in overrides ? overrides.account : freshAccount(),
  ...overrides,
});

const renderRequest = (initial: ExitDelayRequest) =>
  renderHook((props: ExitDelayRequest) => useExitDelay(props), {
    initialProps: initial,
  });

const HELD = { delaySeconds: 172800, unknown: false };

describe('useExitDelay', () => {
  beforeEach(() => {
    mockBlockNumber.mockImplementation((chainId: string) =>
      chainId === STALLED ? new Promise(() => undefined) : Promise.resolve(100),
    );
  });

  it('reports checking, not "no hold", before the block number is known', async () => {
    const { result } = renderRequest(request({ chainId: STALLED }));

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(result.current.loading).toBe(true);
    expect(getExitDelayDisplay(result.current)).toBe('checking');
    expect(mockQuoteExitDelay).not.toHaveBeenCalled();
  });

  it('resolves to "could not read" once the bounded wait passes without a quote', async () => {
    const { result } = renderRequest(
      request({ chainId: STALLED, timeoutMs: 50 }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.unknown).toBe(true);
    expect(getExitDelayDisplay(result.current)).toBe('unknown');
  });

  it('reports the quote once it arrives', async () => {
    mockQuoteExitDelay.mockResolvedValue(HELD);

    const { result } = renderRequest(request());

    expect(getExitDelayDisplay(result.current)).toBe('checking');
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.delaySeconds).toBe(172800);
  });

  it('waits for a consumer that has not loaded, then quotes it rather than keeping a zero', async () => {
    mockQuoteExitDelay.mockResolvedValue(HELD);
    const account = freshAccount();

    const { result, rerender } = renderRequest(
      request({ account, consumerAddress: undefined }),
    );
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(result.current.loading).toBe(true);
    expect(mockQuoteExitDelay).not.toHaveBeenCalled();

    rerender(request({ account }));

    await waitFor(() => expect(result.current.delaySeconds).toBe(172800));
    expect(result.current.loading).toBe(false);
  });

  it("never shows one question's quote as the answer to another", async () => {
    mockQuoteExitDelay.mockResolvedValueOnce(HELD);
    const account = freshAccount();

    const { result, rerender } = renderRequest(request({ account }));
    await waitFor(() => expect(result.current.delaySeconds).toBe(172800));

    mockQuoteExitDelay.mockReturnValue(new Promise(() => undefined));
    rerender(request({ account, subProduct: OTHER_SUB_PRODUCT }));

    expect(result.current.loading).toBe(true);
    expect(result.current.delaySeconds).toBe(0);
    await waitFor(() =>
      expect(mockQuoteExitDelay).toHaveBeenLastCalledWith(
        expect.objectContaining({ subProduct: OTHER_SUB_PRODUCT }),
      ),
    );
  });

  it('passes the consumer, surface, product and account to the quote', async () => {
    mockQuoteExitDelay.mockResolvedValue(HELD);
    const account = freshAccount();

    const { result } = renderRequest(request({ account }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockQuoteExitDelay).toHaveBeenCalledWith({
      chainId: RSK,
      consumerAddress: PROTOCOL,
      surfaceId: SURFACE,
      subProduct: SUB_PRODUCT,
      account,
    });
  });

  it('reports no hold without a wallet: there is no withdrawal to describe', () => {
    const { result } = renderRequest(request({ account: undefined }));

    expect(result.current).toEqual({
      delaySeconds: 0,
      unknown: false,
      loading: false,
    });
  });

  it('reports "could not read" when the consumer address cannot be resolved', () => {
    const { result } = renderRequest(
      request({ consumerAddress: undefined, consumerUnresolvable: true }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.unknown).toBe(true);
  });
});
