import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useLoaderData } from 'react-router-dom';

import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { decimalic } from '../../../../../../../../../utils/math';
import {
  ProtocolTypes,
  ProtocolSectionProps,
} from '../../../../ProtocolSection.types';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../../../ProtocolSection.utils';

export const StabilityPoolTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  btcPrice,
  onValueChange,
}) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();

  const [balance, setBalance] = useState(Decimal.ZERO);

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const renderTotalBalance = useMemo(
    () =>
      account ? getConvertedValue(balance, selectedCurrency, btcPrice) : 0,
    [balance, selectedCurrency, btcPrice, account],
  );

  const getStabilityDeposit = useCallback(async () => {
    if (!account || !liquity || !btcPrice) {
      return;
    }
    try {
      const result = await liquity.getStabilityDeposit(account);
      const balance = decimalic(result.currentZUSD.toString()).div(btcPrice);
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching stability deposit:', error);
    }
  }, [account, liquity, btcPrice]);

  useEffect(() => {
    getStabilityDeposit();
  }, [getStabilityDeposit, block]);

  useEffect(() => {
    onValueChange(balance, ProtocolTypes.STABILITY_POOL);
  }, [balance, onValueChange]);

  return (
    <AmountRenderer
      value={renderTotalBalance}
      suffix={selectedCurrency}
      precision={getCurrencyPrecision(selectedCurrency)}
      isAnimated
    />
  );
};
