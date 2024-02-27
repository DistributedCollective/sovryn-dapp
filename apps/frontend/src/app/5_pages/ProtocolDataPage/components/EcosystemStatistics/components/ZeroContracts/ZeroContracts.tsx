import React, { FC, useEffect, useMemo, useState } from 'react';

import { useLoaderData } from 'react-router-dom';

import {
  EthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useBlockNumber } from '../../../../../../../hooks/useBlockNumber';
import { decimalic } from '../../../../../../../utils/math';
import {
  getConvertedValue,
  getCurrencyPrecision,
} from '../../../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { EcosystemContracts } from '../../EcosystemStatistics.types';
import { EcosystemStatisticsProps } from '../../EcosystemStatistics.types';

export const ZeroContracts: FC<EcosystemStatisticsProps> = ({
  selectedCurrency,
  btcPrice,
  onChange,
}) => {
  const [zusdSupply, setZusdSupply] = useState(Decimal.ZERO);
  const [zeroPrice, setZeroPrice] = useState(Decimal.ZERO);
  const { value: blockNumber } = useBlockNumber();

  const { liquity } = useLoaderData() as {
    liquity: EthersLiquity;
    provider: ReadableEthersLiquityWithStore;
  };

  const renderBalance = useMemo(
    () =>
      getConvertedValue(
        decimalic(zusdSupply).div(zeroPrice),
        selectedCurrency,
        btcPrice,
      ),
    [zusdSupply, zeroPrice, selectedCurrency, btcPrice],
  );

  useEffect(() => {
    liquity.getTotal().then(result => {
      setZusdSupply(decimalic(result.debt.toString()));
    });
    liquity
      .getPrice()
      .then(result => setZeroPrice(decimalic(result.toString())));
  }, [liquity, blockNumber]);

  useEffect(() => {
    onChange(EcosystemContracts.ZeroContracts, decimalic(renderBalance));
  }, [renderBalance, onChange]);

  return (
    <AmountRenderer
      value={renderBalance}
      suffix={selectedCurrency}
      precision={getCurrencyPrecision(selectedCurrency)}
      dataAttribute="ecosystem-statistics-zero-contracts-value"
    />
  );
};
