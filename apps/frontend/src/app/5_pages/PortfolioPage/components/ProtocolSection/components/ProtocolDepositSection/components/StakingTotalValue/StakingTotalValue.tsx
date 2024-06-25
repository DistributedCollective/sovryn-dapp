import React, { FC, useEffect, useMemo, useState } from 'react';

import { getAssetData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { COMMON_SYMBOLS } from '../../../../../../../../../utils/asset';
import { removeTrailingZerosFromString } from '../../../../../../../../../utils/helpers';
import { decimalic, fromWei } from '../../../../../../../../../utils/math';
import { getSmartRouter } from '../../../../../../../ConvertPage/ConvertPage.utils';
import { useGetStakingBalanceOf } from '../../../../../../../StakePage/hooks/useGetStakingBalanceOf';
import {
  ProtocolSectionProps,
  ProtocolTypes,
} from '../../../../ProtocolSection.types';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../../../ProtocolSection.utils';
import { getNativeCurrency } from './StakingTotalValue.utils';

export const StakingTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  nativeTokenPrice,
  onValueChange,
}) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();
  const [balance, setBalance] = useState(Decimal.ZERO);

  const chainId = useCurrentChain();

  const { balance: stakedValue } = useGetStakingBalanceOf(account);

  const nativeCurrency = useMemo(() => getNativeCurrency(chainId), [chainId]);

  const renderTotalBalance = useMemo(
    () =>
      account
        ? getConvertedValue(
            balance,
            selectedCurrency,
            nativeTokenPrice,
            chainId,
          )
        : 0,
    [account, balance, selectedCurrency, nativeTokenPrice, chainId],
  );

  const smartRouter = useMemo(() => getSmartRouter(chainId), [chainId]);

  useEffect(() => {
    if (Number(stakedValue) > 0) {
      (async () => {
        const [sourceTokenDetails, destinationTokenDetails] = await Promise.all(
          [
            getAssetData(COMMON_SYMBOLS.SOV, chainId),
            getAssetData(nativeCurrency, chainId),
          ],
        );

        const result = await smartRouter.getBestQuote(
          chainId,
          sourceTokenDetails.address,
          destinationTokenDetails.address,
          stakedValue.toString(),
        );

        const quote = removeTrailingZerosFromString(
          fromWei(result.quote.toString()),
        );
        setBalance(decimalic(quote));
      })();
    }
  }, [
    stakedValue,
    selectedCurrency,
    block,
    chainId,
    smartRouter,
    nativeCurrency,
  ]);

  useEffect(() => {
    if (balance.gt(Decimal.ZERO) && account) {
      onValueChange(balance, ProtocolTypes.STAKING);
    }
  }, [balance, onValueChange, account]);

  useEffect(() => {
    if (!account || Number(stakedValue) === 0) {
      setBalance(Decimal.ZERO);
      onValueChange(Decimal.ZERO, ProtocolTypes.STAKING);
    }
  }, [account, stakedValue, onValueChange]);

  return (
    <AmountRenderer
      value={renderTotalBalance}
      suffix={selectedCurrency}
      precision={getCurrencyPrecision(selectedCurrency)}
      isAnimated
    />
  );
};
