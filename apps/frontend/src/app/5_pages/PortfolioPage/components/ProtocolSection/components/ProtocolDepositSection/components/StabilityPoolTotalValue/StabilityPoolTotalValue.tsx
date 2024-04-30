import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useLoaderData } from 'react-router-dom';

import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';
import { ChainIds } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { isBobChain } from '../../../../../../../../../utils/chain';
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
  nativeTokenPrice,
  onValueChange,
}) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();

  const chainId = useCurrentChain();
  const [balance, setBalance] = useState(Decimal.ZERO);

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

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

  const getStabilityDeposit = useCallback(async () => {
    if (!account || !liquity || !nativeTokenPrice) {
      return;
    }
    if (liquity.connection.chainId !== Number(chainId)) {
      return;
    }
    try {
      const result = await liquity.getStabilityDeposit(account);
      const balance = decimalic(result.currentZUSD.toString()).div(
        nativeTokenPrice,
      );
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching stability deposit:', error);
    }
  }, [account, liquity, nativeTokenPrice, chainId]);

  useEffect(() => {
    getStabilityDeposit();
  }, [getStabilityDeposit, block]);

  useEffect(() => {
    onValueChange(balance, ProtocolTypes.STABILITY_POOL);
  }, [balance, onValueChange]);

  if (isBobChain(chainId) || chainId === ChainIds.SEPOLIA) {
    return (
      <AmountRenderer
        value={0}
        suffix={selectedCurrency}
        precision={getCurrencyPrecision(selectedCurrency)}
        isAnimated
      />
    );
  }

  return (
    <AmountRenderer
      value={renderTotalBalance}
      suffix={selectedCurrency}
      precision={getCurrencyPrecision(selectedCurrency)}
      isAnimated
    />
  );
};
