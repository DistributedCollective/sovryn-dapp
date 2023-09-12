import { useCallback, useEffect, useState } from 'react';

import { Contract } from 'ethers';

import {
  SupportedTokens,
  getLoanTokenContract,
  getTokenContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal, Decimalish } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { useIsMounted } from '../../../../../../hooks/useIsMounted';
import { decimalic } from '../../../../../../utils/math';

export const useDepositAmountForBorrow = (
  token: SupportedTokens,
  collateral: SupportedTokens,
  borrowAmount: Decimalish,
  duration: number,
): [Decimal, boolean] => {
  const isMounted = useIsMounted();

  const [amount, setAmount] = useState<Decimal>(Decimal.ZERO);
  const [loading, setLoading] = useState(false);

  const getDepositAmountForBorrow = useCallback(
    async (
      token: SupportedTokens,
      collateral: SupportedTokens,
      amount: Decimalish,
      duration,
    ) => {
      const { abi: borrowTokenAbi, address: borrowTokenAddress } =
        await getLoanTokenContract(token, defaultChainId);
      const { address: tokenAddress } = await getTokenContract(
        collateral,
        defaultChainId,
      );

      const borrowTokenContract = new Contract(
        borrowTokenAddress,
        borrowTokenAbi,
        getProvider(defaultChainId),
      );

      const borrowAmount = await borrowTokenContract.getDepositAmountForBorrow(
        decimalic(amount).toHexString(),
        Math.ceil(duration - Date.now() / 1000),
        tokenAddress,
      );

      return Decimal.fromBigNumberString(borrowAmount);
    },
    [],
  );

  useEffect(() => {
    if (isMounted()) {
      setLoading(true);
      getDepositAmountForBorrow(token, collateral, borrowAmount, duration)
        .then(depositAmount => {
          if (isMounted()) {
            setAmount(depositAmount);
          }
        })
        .catch(e => {
          if (isMounted()) {
            setAmount(Decimal.ZERO);
          }
          console.error(e);
        })
        .finally(() => {
          if (isMounted()) {
            setLoading(false);
          }
        });
    }
  }, [
    borrowAmount,
    collateral,
    duration,
    getDepositAmountForBorrow,
    isMounted,
    token,
  ]);

  return [amount, loading];
};
