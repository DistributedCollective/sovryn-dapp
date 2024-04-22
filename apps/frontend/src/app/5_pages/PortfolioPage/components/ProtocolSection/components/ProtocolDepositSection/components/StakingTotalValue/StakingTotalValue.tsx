import React, { FC, useEffect, useMemo, useState } from 'react';

import { getAssetData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { COMMON_SYMBOLS } from '../../../../../../../../../utils/asset';
import { removeTrailingZerosFromString } from '../../../../../../../../../utils/helpers';
import { decimalic, fromWei } from '../../../../../../../../../utils/math';
import { SMART_ROUTER_RSK } from '../../../../../../../ConvertPage/ConvertPage.constants';
import { useGetStakingBalanceOf } from '../../../../../../../StakePage/hooks/useGetStakingBalanceOf';
import {
  ProtocolSectionProps,
  ProtocolTypes,
} from '../../../../ProtocolSection.types';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../../../ProtocolSection.utils';

export const StakingTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  btcPrice,
  onValueChange,
}) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();
  const [balance, setBalance] = useState(Decimal.ZERO);
  const chainId = useCurrentChain();

  const { balance: stakedValue } = useGetStakingBalanceOf(account);

  const renderTotalBalance = useMemo(
    () =>
      account
        ? getConvertedValue(balance, selectedCurrency, btcPrice, chainId)
        : 0,
    [account, balance, selectedCurrency, btcPrice, chainId],
  );

  useEffect(() => {
    if (Number(stakedValue) > 0) {
      (async () => {
        const [sourceTokenDetails, destinationTokenDetails] = await Promise.all(
          [
            getAssetData(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID),
            getAssetData(COMMON_SYMBOLS.BTC, RSK_CHAIN_ID),
          ],
        );

        const result = await SMART_ROUTER_RSK.getBestQuote(
          RSK_CHAIN_ID,
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
  }, [stakedValue, selectedCurrency, block]);

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
