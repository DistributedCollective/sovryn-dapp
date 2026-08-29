import { useMemo } from 'react';

import { Contract, constants } from 'ethers';

import { getZeroContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { asyncCall } from '../../store/rxjs/provider-cache';
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
const CONTROLLER_GETTER_ABI = [
  'function exitFeeController() view returns (address)',
];

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
      if (grossWei === null) {
        // An explicit zero gross: nothing leaves, so no fee can be charged.
        // That is a real answer, not a failure to get one -- reporting it as
        // unknown would put "fee unavailable" on every add-collateral and
        // borrow form, where no exit is happening at all.
        return INACTIVE;
      }
      if (!account) {
        return { ...INACTIVE, unknown: true };
      }
      try {
        const { address } = await getZeroContract(
          'borrowerOperations',
          getRskChainId(),
        );
        /**
         * Same split as the lending hook. A missing or reverting
         * `exitFeeController()` is what Zero looks like before the perimeter
         * ships: nothing is charged, and the form must look untouched. Only
         * once that pointer resolves does a failing preview mean we genuinely
         * do not know the rate.
         */
        const pointer = new Contract(
          address,
          CONTROLLER_GETTER_ABI,
          getProvider(getRskChainId()),
        );
        let controllerAddress;
        try {
          controllerAddress = await asyncCall(
            `exitFee/zeroController/${getRskChainId()}/${address}`,
            () => pointer.exitFeeController(),
            { ttl: EXIT_FEE_TTL },
          );
        } catch (error) {
          return INACTIVE;
        }
        if (!controllerAddress || controllerAddress === constants.AddressZero) {
          return INACTIVE;
        }

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
