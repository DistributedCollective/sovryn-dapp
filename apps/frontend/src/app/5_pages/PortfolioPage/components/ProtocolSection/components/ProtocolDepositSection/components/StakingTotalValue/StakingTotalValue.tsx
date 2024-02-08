import React, { FC, useEffect, useMemo, useState } from 'react';

import { SupportedTokens, getTokenDetails } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../../../../config/chains';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { removeTrailingZerosFromString } from '../../../../../../../../../utils/helpers';
import { decimalic, fromWei } from '../../../../../../../../../utils/math';
import { smartRouter } from '../../../../../../../ConvertPage/ConvertPage.types';
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

  const { balance: stakedValue } = useGetStakingBalanceOf(account);

  const renderTotalBalance = useMemo(
    () =>
      account ? getConvertedValue(balance, selectedCurrency, btcPrice) : 0,
    [balance, selectedCurrency, btcPrice, account],
  );

  useEffect(() => {
    if (Number(stakedValue) > 0) {
      (async () => {
        const [sourceTokenDetails, destinationTokenDetails] = await Promise.all(
          [
            getTokenDetails(SupportedTokens.sov, defaultChainId),
            getTokenDetails(SupportedTokens.rbtc, defaultChainId),
          ],
        );

        const result = await smartRouter.getBestQuote(
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
