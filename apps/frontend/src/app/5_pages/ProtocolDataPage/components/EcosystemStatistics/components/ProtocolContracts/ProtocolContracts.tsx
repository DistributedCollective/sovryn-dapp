import React, { FC, useEffect } from 'react';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useGetData } from '../../../../../LandingPage/components/ProtocolData/hooks/useGetData';
import { getCurrencyPrecision } from '../../../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { EcosystemContracts } from '../../EcosystemStatistics.types';
import { EcosystemStatisticsProps } from '../../EcosystemStatistics.types';

export const ProtocolContracts: FC<EcosystemStatisticsProps> = ({
  selectedCurrency,
  onChange,
}) => {
  const { lockedData } = useGetData();

  useEffect(() => {
    onChange(
      EcosystemContracts.ProtocolContracts,
      lockedData[selectedCurrency.toLowerCase()],
    );
  }, [lockedData, selectedCurrency, onChange]);

  return (
    <AmountRenderer
      value={lockedData[selectedCurrency.toLowerCase()]}
      suffix={selectedCurrency}
      precision={getCurrencyPrecision(selectedCurrency)}
      dataAttribute="ecosystem-statistics-protocol-contracts-value"
    />
  );
};
