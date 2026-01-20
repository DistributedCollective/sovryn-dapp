import { useQuery } from '@tanstack/react-query';

import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { useGetTokenContract } from '../../../../../../hooks/useGetContract';
import {
  COMMON_SYMBOLS,
  maybeWrappedAsset,
} from '../../../../../../utils/asset';
import { decimalic } from '../../../../../../utils/math';
import { useGetTokenPrice } from '../../../../BorrowPage/hooks/useGetTokenPrice';
import { useGetReturnRate } from '../../../hooks/useGetReturnRate';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';

export const useGetPoolBalanceAndRewards = (
  pool: AmmLiquidityPool,
  newPoolBalanceA: Decimal,
  newPoolBalanceB: Decimal,
  isTokenA: boolean,
  isV2Pool: boolean,
) => {
  const poolContract = useGetTokenContract(COMMON_SYMBOLS.WBTC, RSK_CHAIN_ID);

  const tokenContractA = useGetTokenContract(
    maybeWrappedAsset(pool.assetA),
    RSK_CHAIN_ID,
  );
  const tokenContractB = useGetTokenContract(
    maybeWrappedAsset(pool.assetB),
    RSK_CHAIN_ID,
  );
  const { data: tokenPriceA } = useGetTokenPrice(tokenContractA?.address || '');
  const { data: tokenPriceB } = useGetTokenPrice(tokenContractB?.address || '');
  const returnRates = useGetReturnRate(pool);

  const { data: weeklyRewardsEstimation } = useQuery({
    queryKey: [
      'poolBalanceAndRewards',
      pool.converter,
      newPoolBalanceA.toString(),
      newPoolBalanceB.toString(),
      tokenPriceA,
      tokenPriceB,
      isTokenA,
      isV2Pool,
      returnRates,
    ],
    queryFn: async () => {
      if (
        !poolContract ||
        !newPoolBalanceA ||
        !tokenPriceA ||
        !tokenContractA
      ) {
        return Decimal.ZERO;
      }
      const poolBalance = await poolContract
        .balanceOf(pool.converter)
        .then(Decimal.fromBigNumberString);
      if (poolBalance) {
        if (isV2Pool) {
          const balance = isTokenA ? newPoolBalanceA : newPoolBalanceB;
          return balance
            .mul(
              decimalic(
                isTokenA
                  ? tokenPriceA.token?.lastPriceBtc || '0'
                  : tokenPriceB?.token?.lastPriceBtc || '0',
              ),
            )
            .mul(decimalic(returnRates.beforeRewards).div(100))
            .div(52);
        } else {
          const value1 = newPoolBalanceA
            .mul(decimalic(tokenPriceA?.token?.lastPriceBtc || '0'))
            .mul(decimalic(returnRates.beforeRewards).div(100))
            .div(52);
          const value2 = newPoolBalanceB
            .mul(decimalic(tokenPriceB?.token?.lastPriceBtc || '0'))
            .mul(decimalic(returnRates.beforeRewards).div(100))
            .div(52);
          return value1.add(value2);
        }
      }

      return Decimal.ZERO;
    },
    enabled:
      !!poolContract && !!newPoolBalanceA && !!tokenPriceA && !!tokenContractA,
    initialData: Decimal.ZERO,
  });

  return { weeklyRewardsEstimation };
};
