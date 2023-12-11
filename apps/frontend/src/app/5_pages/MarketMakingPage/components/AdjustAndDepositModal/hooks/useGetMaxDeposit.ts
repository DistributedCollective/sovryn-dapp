import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useGasPrice } from '../../../../../../hooks/useGasPrice';
import { useGetTokenContract } from '../../../../../../hooks/useGetContract';
import { useGetTokenPrice } from '../../../../BorrowPage/hooks/useGetTokenPrice';

export const useGetMaxDeposit = (asset: SupportedTokens) => {
  const { balance: balanceTokenA } = useAssetBalance(asset, defaultChainId);
  const { balance: balanceTokenB } = useAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
  );

  const contractTokenA = useGetTokenContract(asset, defaultChainId);

  const gasPrice = useGasPrice(defaultChainId);

  const gasLimit = useMemo(
    () => gasPrice.mul(GAS_LIMIT.MAX).div(Decimal.from(10).pow(8)),
    [gasPrice],
  );

  const { data } = useGetTokenPrice(contractTokenA?.address || '');

  const priceTokenA = useMemo(() => {
    if (!data?.token?.lastPriceBtc) {
      return Decimal.ZERO;
    }
    return Decimal.ONE.div(Decimal.from(data?.token?.lastPriceBtc));
  }, [data]);

  const maxDepositValue = useMemo(() => {
    if (!balanceTokenB || !priceTokenA || !balanceTokenA) {
      return Decimal.ZERO;
    }
    const maxDeposit = balanceTokenB.sub(gasLimit).mul(priceTokenA);

    return balanceTokenB.mul(priceTokenA).lt(balanceTokenA)
      ? maxDeposit
      : balanceTokenA;
  }, [balanceTokenA, balanceTokenB, priceTokenA, gasLimit]);

  return maxDepositValue;
};
