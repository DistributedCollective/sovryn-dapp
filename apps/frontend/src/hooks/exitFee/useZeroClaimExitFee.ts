import { useMemo } from 'react';

import { BigNumber, Contract, constants } from 'ethers';

import { getZeroContract } from '@sovryn/contracts';
import { ChainId, getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { getRskChainId } from '../../utils/chain';
import {
  EXIT_FEE_MAX_BPS,
  EXIT_FEE_TTL,
  ExitFeeQuote,
  SURFACE_ZERO_CLAIM_SURPLUS,
} from '../../utils/exitFee';
import { readPerimeterPointer } from '../exitDelay/readPerimeterPointer';
import {
  EXIT_DELAY_QUOTE_TIMEOUT_MS,
  useDeadlinePassed,
} from '../exitDelay/useExitDelay';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';

export type ZeroClaimExitFee = ExitFeeQuote & {
  feeAmount: Decimal;
  netAmount: Decimal;
};

type ClaimQuote = Omit<ZeroClaimExitFee, 'loading'>;

/** A stated "no fee": nothing is charged, and the rows stay hidden. */
const INACTIVE: ClaimQuote = {
  active: false,
  rateBps: 0,
  feeAmount: Decimal.ZERO,
  netAmount: Decimal.ZERO,
  unknown: false,
};

/** No quote obtained. The rows stay hidden too, since the fee fails open. */
const UNKNOWN: ClaimQuote = { ...INACTIVE, unknown: true };

const CONTROLLER_ABI = [
  'function quoteExitFee(bytes32 surfaceId, address subProduct, address actor, uint256 grossAmount) view returns (tuple(bool active, uint16 rateBps, uint256 feeAmount, uint256 netAmount, address feeReceiver, uint8 reason))',
];

const quoteClaimFee = async (
  chainId: ChainId,
  account: string | undefined,
  grossWei: string | null,
): Promise<ClaimQuote> => {
  if (grossWei === null) {
    // Nothing to claim, so nothing can be charged.
    return INACTIVE;
  }
  if (!account) {
    return UNKNOWN;
  }

  let borrowerOperations: string;
  try {
    ({ address: borrowerOperations } = await getZeroContract(
      'borrowerOperations',
      chainId,
    ));
  } catch (error) {
    return UNKNOWN;
  }

  const pointer = await readPerimeterPointer(
    chainId,
    borrowerOperations,
    'exitFeeController',
  );
  if (pointer.kind === 'unreadable') {
    return UNKNOWN;
  }
  if (pointer.kind === 'absent' || pointer.address === constants.AddressZero) {
    return INACTIVE;
  }

  try {
    const quote = await new Contract(
      pointer.address,
      CONTROLLER_ABI,
      getProvider(chainId),
    ).quoteExitFee(
      SURFACE_ZERO_CLAIM_SURPLUS,
      constants.AddressZero,
      account,
      grossWei,
    );
    // The claim re-derives net from gross and fee and charges nothing when
    // they disagree, so a quote that does not add up is not one to display.
    const gross = BigNumber.from(grossWei);
    if (
      quote.feeAmount.gt(gross) ||
      !quote.netAmount.eq(gross.sub(quote.feeAmount)) ||
      Number(quote.rateBps) > EXIT_FEE_MAX_BPS
    ) {
      return INACTIVE;
    }
    return {
      active: quote.active,
      rateBps: Number(quote.rateBps),
      feeAmount: Decimal.fromBigNumberString(quote.feeAmount.toString()),
      netAmount: Decimal.fromBigNumberString(quote.netAmount.toString()),
      unknown: false,
    };
  } catch (error) {
    return UNKNOWN;
  }
};

/**
 * The Perimeter fee on claiming a Zero collateral surplus, quoted the way the
 * claim is charged.
 *
 * Zero's BorrowerOperations charges the claim through its own controller
 * pointer, independently settable from the lending protocol's, so the quote
 * follows that pointer: for the claim surface, the single Zero deployment
 * (sub-product zero), this account, and the actual surplus. The fee and net
 * are the controller's own figures for this claim; the fee itself is set when
 * the claim executes.
 *
 * The fee fails OPEN on chain, so every answer but a charged quote leaves the
 * rows hidden. The hook still reports a stated "no fee" apart from a quote
 * that was not obtained (`unknown`), and a value fetched for another account
 * or surplus is reported as loading.
 */
export const useZeroClaimExitFee = (gross: Decimal): ZeroClaimExitFee => {
  const { account } = useAccount();
  const chainId = getRskChainId() as ChainId;

  const grossWei = useMemo(
    () => (gross.isZero() ? null : gross.toBigNumber().toString()),
    [gross],
  );

  const key = `exitFee/zeroClaim/${chainId}/${account}/${grossWei}`;

  const { value, loading } = useCacheCall(
    key,
    chainId,
    async () => ({
      ...(await quoteClaimFee(chainId, account, grossWei)),
      forKey: key,
    }),
    [key],
    { ...INACTIVE, forKey: '' },
    { ttl: EXIT_FEE_TTL },
  );

  // A quote that has not arrived within the same deadline the delay quote is
  // given is reported as unknown, so the surplus card can let the holder see
  // Withdraw rather than wait on a stalled read.
  const fresh = value.forKey === key;
  const passed = useDeadlinePassed(
    key,
    fresh && !loading,
    EXIT_DELAY_QUOTE_TIMEOUT_MS,
  );

  return useMemo(() => {
    if (!fresh && passed) {
      return { ...UNKNOWN, loading: false };
    }
    if (!fresh) {
      return { ...INACTIVE, loading: true };
    }
    const { forKey, ...quote } = value;
    return { ...quote, loading };
  }, [value, loading, fresh, passed]);
};
