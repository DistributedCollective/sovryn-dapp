import { useMemo } from 'react';

import { Contract, constants, ethers } from 'ethers';

import { getZeroContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { getRskChainId } from '../../utils/chain';
import {
  EXIT_FEE_MAX_BPS,
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

/**
 * Stamp a fetched quote with the cache key it was fetched FOR. The shared
 * cache keeps its previous state until a changed key's result lands, so on
 * the first render after an account or gross switch `value` still belongs to
 * the old key. Only a quote whose stamp matches the current key is displayed.
 */
const stamped = async <T extends object>(
  forKey: string,
  fetch: () => Promise<T>,
) => ({ ...(await fetch()), forKey });

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

  const key = `exitFee/zero/${account}/${grossWei}`;

  const { value, loading } = useCacheCall(
    key,
    getRskChainId(),
    () =>
      stamped(key, async () => {
        if (grossWei === null) {
          // An explicit zero gross: nothing leaves, so no fee can be charged.
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
          if (
            !controllerAddress ||
            controllerAddress === constants.AddressZero
          ) {
            return INACTIVE;
          }

          const borrowerOperations = new Contract(
            address,
            PREVIEW_ABI,
            getProvider(getRskChainId()),
          );
          const result =
            await borrowerOperations.previewZeroCollWithdrawExitFee(
              account,
              grossWei,
            );
          // The preview fails OPEN, exactly as the live charge does: when the
          // controller is unreachable or hands back an unusable quote it returns
          // active=false with a zero fee, and at execution the same path charges
          // nothing and pays the gross. So `active=false` here IS the answer —
          // no fee is taken — and the rows stay hidden. The reason is not
          // consulted: whichever it is, the user receives the whole amount.
          // A quote the chain itself would refuse is not one to display. The
          // on-chain hook re-derives net from gross and fee and charges nothing
          // when they disagree, so mirror that test here: an inconsistent
          // preview — only a tampered RPC can produce one — hides the rows
          // rather than printing a net the chain will not pay.
          const gross = ethers.BigNumber.from(grossWei);
          if (
            result.feeAmount.gt(gross) ||
            !result.netAmount.eq(gross.sub(result.feeAmount)) ||
            Number(result.rateBps) > EXIT_FEE_MAX_BPS
          ) {
            return INACTIVE;
          }
          return {
            active: result.active,
            rateBps: Number(result.rateBps),
            feeAmount: Decimal.fromBigNumberString(result.feeAmount.toString()),
            netAmount: Decimal.fromBigNumberString(result.netAmount.toString()),
            unknown: false,
          };
        } catch (error) {
          // The preview itself could not be called. `unknown` records that for
          // the consumers, and every consumer hides the rows for it: the chain
          // fails open, so nothing is charged and the gross is paid.
          return { ...INACTIVE, unknown: true };
        }
      }),
    [account, grossWei],
    { ...INACTIVE, forKey: '' },
    { ttl: EXIT_FEE_TTL },
  );

  return useMemo(() => {
    // A value fetched for a different key belongs to the previous account or
    // gross. Report it as still loading — displayed as nothing charged — rather
    // than showing that other quote's numbers for one frame.
    const fresh = value.forKey === key;
    return fresh ? { ...value, loading } : { ...INACTIVE, loading: true };
  }, [value, loading, key]);
};
