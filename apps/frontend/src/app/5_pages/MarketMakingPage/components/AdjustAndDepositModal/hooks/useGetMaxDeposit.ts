import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useGasPrice } from '../../../../../../hooks/useGasPrice';
import { useGetTokenContract } from '../../../../../../hooks/useGetContract';
import { composeGas } from '../../../../../../utils/helpers';
import { useGetTokenPrice } from '../../../../BorrowPage/hooks/useGetTokenPrice';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';
import { useGetPoolsBalance } from './useGetPoolsBalance';

export const useGetMaxDeposit = (
  pool: AmmLiquidityPool,
  isDeposit: boolean,
) => {
  const { balance: balanceTokenA } = useAssetBalance(
    pool.assetA,
    defaultChainId,
  );
  const { balance: balanceTokenB } = useAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
  );

  const { poolBalanceA, poolBalanceB } = useGetPoolsBalance(pool);

  const contractTokenA = useGetTokenContract(pool.assetA, defaultChainId);

  const gasPrice = useGasPrice(defaultChainId);

  const gasLimit = useMemo(
    () =>
      composeGas(
        gasPrice || '0',
        isDeposit
          ? GAS_LIMIT.MARKET_MAKING_ADD_LIQUIDITY
          : GAS_LIMIT.MARKET_MAKING_REMOVE_LIQUIDITY,
      ),
    [gasPrice, isDeposit],
  );

  const balanceBtcWithoutGas = useMemo(
    () => balanceTokenB.sub(gasLimit),
    [balanceTokenB, gasLimit],
  );

  const { data } = useGetTokenPrice(contractTokenA?.address || '');

  const maxAllowedTokenAmount: Decimal = useMemo(
    () => balanceBtcWithoutGas.mul(poolBalanceA).div(poolBalanceB),
    [poolBalanceA, poolBalanceB, balanceBtcWithoutGas],
  );

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

  const maximumV1Deposit = useMemo(
    () =>
      maxDepositValue.lte(maxAllowedTokenAmount)
        ? maxDepositValue
        : maxAllowedTokenAmount,
    [maxAllowedTokenAmount, maxDepositValue],
  );

  return { maximumV1Deposit, balanceTokenA, balanceTokenB };
};
