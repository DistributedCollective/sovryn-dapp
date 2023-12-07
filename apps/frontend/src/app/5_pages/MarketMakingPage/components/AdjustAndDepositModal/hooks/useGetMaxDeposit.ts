import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useGetTokenContract } from '../../../../../../hooks/useGetContract';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';
import { getRskChainId } from '../../../../../../utils/chain';
import { useGetTokenPrice } from '../../../../BorrowPage/hooks/useGetTokenPrice';

export const useGetMaxDeposit = (
  asset: SupportedTokens,
  isDeposit: boolean,
) => {
  const { balance: balanceTokenB } = useMaxAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
    isDeposit
      ? GAS_LIMIT.MARKET_MAKING_ADD_LIQUIDITY
      : GAS_LIMIT.MARKET_MAKING_REMOVE_LIQUIDITY,
  );

  const { balance: balanceTokenA } = useAssetBalance(asset, getRskChainId());
  const contractTokenA = useGetTokenContract(asset, getRskChainId());

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
    const maxDeposit = balanceTokenB.mul(priceTokenA);
    return balanceTokenB.mul(priceTokenA).lt(balanceTokenA)
      ? maxDeposit
      : balanceTokenA;
  }, [balanceTokenA, balanceTokenB, priceTokenA]);

  return maxDepositValue;
};
