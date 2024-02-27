import React, { FC, useEffect, useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useLoadContract } from '../../../../../../../hooks/useLoadContract';
import { useQueryRate } from '../../../../../../../hooks/useQueryRate';
import { getRskChainId } from '../../../../../../../utils/chain';
import { decimalic } from '../../../../../../../utils/math';
import {
  getConvertedValue,
  getCurrencyPrecision,
} from '../../../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { EcosystemContracts } from '../../EcosystemStatistics.constants';
import { EcosystemStatisticsProps } from '../../EcosystemStatistics.types';

export const BitocracyStakingContract: FC<EcosystemStatisticsProps> = ({
  selectedCurrency,
  btcPrice,
  onChange,
}) => {
  const stakingContract = useLoadContract('staking', 'protocol');
  const totalStakedSov = useAssetBalance(
    SupportedTokens.sov,
    getRskChainId(),
    stakingContract?.address,
  );

  const [rate] = useQueryRate(SupportedTokens.sov, SupportedTokens.rbtc);

  const convertedBalance = useMemo(
    () => totalStakedSov.balance.mul(rate),
    [totalStakedSov, rate],
  );

  const renderBalance = useMemo(
    () => getConvertedValue(convertedBalance, selectedCurrency, btcPrice),
    [convertedBalance, selectedCurrency, btcPrice],
  );

  useEffect(() => {
    onChange(
      EcosystemContracts.BitocracyStakingContract,
      decimalic(renderBalance),
      false,
    );
  }, [renderBalance, onChange]);

  return (
    <AmountRenderer
      value={renderBalance}
      suffix={selectedCurrency}
      precision={getCurrencyPrecision(selectedCurrency)}
      dataAttribute="ecosystem-statistics-bitocracy-staking-contract-value"
    />
  );
};
