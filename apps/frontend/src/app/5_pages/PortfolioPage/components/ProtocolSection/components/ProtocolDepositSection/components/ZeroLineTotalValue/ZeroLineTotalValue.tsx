import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useLoaderData } from 'react-router-dom';

import { UserTrove } from '@sovryn-zero/lib-base';
import { ChainIds } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { isBobChain } from '../../../../../../../../../utils/chain';
import { decimalic } from '../../../../../../../../../utils/math';
import { ZeroPageLoaderData } from '../../../../../../../ZeroPage/loader';
import {
  ProtocolTypes,
  ProtocolSectionProps,
} from '../../../../ProtocolSection.types';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../../../ProtocolSection.utils';

export const ZeroLineTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  btcPrice,
  onValueChange,
}) => {
  const { account } = useAccount();
  const [trove, setTrove] = useState<UserTrove>();
  const { liquity } = useLoaderData() as ZeroPageLoaderData;
  const [balance, setBalance] = useState(Decimal.ZERO);
  const { value: block } = useBlockNumber();
  const chainId = useCurrentChain();

  const renderTotalBalance = useMemo(
    () =>
      account
        ? getConvertedValue(balance, selectedCurrency, btcPrice, chainId)
        : 0,
    [account, balance, selectedCurrency, btcPrice, chainId],
  );

  const getTroves = useCallback(async () => {
    if (!account || !liquity) {
      return;
    }
    if (liquity.connection.chainId !== Number(chainId)) {
      return;
    }
    try {
      const troveData = await liquity.getTrove(account);
      setTrove(troveData);
    } catch (error) {
      console.error('Error fetching Troves:', error);
    }
  }, [account, chainId, liquity]);

  useEffect(() => {
    getTroves();
  }, [getTroves, block]);

  useEffect(() => {
    setBalance(decimalic(trove?.collateral?.toString()));
  }, [trove]);

  useEffect(() => {
    onValueChange(balance, ProtocolTypes.ZERO_LINE_OF_CREDIT);
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
