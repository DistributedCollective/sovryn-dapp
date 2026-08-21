import { useMemo } from 'react';

import { Contract } from 'ethers';

import { getZeroContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { getRskChainId } from '../../utils/chain';
import {
  EXIT_FEE_REFERENCE_GROSS,
  EXIT_FEE_TTL,
  ExitFeeQuote,
} from '../../utils/exitFee';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';

export type ZeroExitFee = ExitFeeQuote & {
  feeAmount: Decimal;
  netAmount: Decimal;
};

const INACTIVE = {
  active: false,
  rateBps: 0,
  feeAmount: Decimal.ZERO,
  netAmount: Decimal.ZERO,
  unknown: false,
};

// The Z-1 kept preview — same _safeQuote path as the live charge hook.
const PREVIEW_ABI = [
  'function previewZeroCollWithdrawExitFee(address borrower, uint256 grossColl) view returns (uint16 rateBps, uint256 feeAmount, uint256 netAmount, address feeReceiver, bool active, uint8 reason)',
];

export const useZeroExitFee = (gross?: Decimal): ZeroExitFee => {
  const { account } = useAccount();

  const grossWei = useMemo(() => {
    if (gross === undefined) {
      return EXIT_FEE_REFERENCE_GROSS; // rate-only mode
    }
    // provided-but-zero gross: quoting the reference here would fabricate
    // numbers for consumers that display the quote directly — stay inactive.
    return gross.isZero() ? null : gross.toBigNumber().toString();
  }, [gross]);

  const { value, loading } = useCacheCall(
    `exitFee/zero/${account}/${grossWei}`,
    getRskChainId(),
    async () => {
      if (!account || grossWei === null) {
        return { ...INACTIVE, unknown: true };
      }
      try {
        const { address } = await getZeroContract(
          'borrowerOperations',
          getRskChainId(),
        );
        const borrowerOperations = new Contract(
          address,
          PREVIEW_ABI,
          getProvider(getRskChainId()),
        );
        const result = await borrowerOperations.previewZeroCollWithdrawExitFee(
          account,
          grossWei,
        );
        return {
          active: result.active,
          rateBps: Number(result.rateBps),
          feeAmount: Decimal.fromBigNumberString(result.feeAmount.toString()),
          netAmount: Decimal.fromBigNumberString(result.netAmount.toString()),
          unknown: false,
        };
      } catch (error) {
        // Same rule as the lending hook: a failed preview is not a zero fee.
        return { ...INACTIVE, unknown: true };
      }
    },
    [account, grossWei],
    INACTIVE,
    { ttl: EXIT_FEE_TTL },
  );

  return useMemo(() => ({ ...value, loading }), [value, loading]);
};
