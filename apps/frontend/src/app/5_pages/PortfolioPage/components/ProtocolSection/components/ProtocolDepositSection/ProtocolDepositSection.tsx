import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { ProtocolSectionProps } from '../../ProtocolSection.types';
import { DepositRow } from '../DepositRow/DepositRow';
import { LendingTotalValue } from './components/LendingTotalValue/LendingTotalValue';
import { MarketMakingTotalValue } from './components/MarketMakingTotalValue/MarketMakingTotalValue';
import { StabilityPoolTotalValue } from './components/StabilityPoolTotalValue/StabilityPoolTotalValue';
import { StakingTotalValue } from './components/StakingTotalValue/StakingTotalValue';
import { ZeroLineTotalValue } from './components/ZeroLineTotalValue/ZeroLineTotalValue';

export const ProtocolDepositSection: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  btcPrice,
  onValueChange,
}) => {
  const navigate = useNavigate();

  const items = useMemo(
    () => [
      {
        title: t(translations.portfolioPage.protocolSection.marketMaking),
        value: (
          <MarketMakingTotalValue
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onValueChange={onValueChange}
          />
        ),
        cta: (
          <Button
            style={ButtonStyle.ghost}
            className="underline"
            text={t(translations.portfolioPage.protocolSection.deposit)}
            onClick={() => navigate('/earn/market-making')}
          />
        ),
      },
      {
        title: t(translations.portfolioPage.protocolSection.stabilityPool),
        value: (
          <StabilityPoolTotalValue
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onValueChange={onValueChange}
          />
        ),
        cta: (
          <Button
            style={ButtonStyle.ghost}
            className="underline"
            text={t(translations.portfolioPage.protocolSection.deposit)}
            onClick={() => navigate('/earn/stability-pool')}
          />
        ),
      },
      {
        title: t(translations.portfolioPage.protocolSection.zeroLine),
        value: (
          <ZeroLineTotalValue
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onValueChange={onValueChange}
          />
        ),
        cta: (
          <Button
            style={ButtonStyle.ghost}
            className="underline"
            text={t(translations.portfolioPage.protocolSection.openLoan)}
            onClick={() => navigate('/borrow/line-of-credit')}
          />
        ),
      },
      {
        title: t(translations.portfolioPage.protocolSection.lending),
        value: (
          <LendingTotalValue
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onValueChange={onValueChange}
          />
        ),
        cta: (
          <Button
            style={ButtonStyle.ghost}
            className="underline"
            text={t(translations.portfolioPage.protocolSection.deposit)}
            onClick={() => navigate('/earn/lend')}
          />
        ),
      },
      {
        title: t(translations.portfolioPage.protocolSection.staking),
        value: (
          <StakingTotalValue
            selectedCurrency={selectedCurrency}
            btcPrice={btcPrice}
            onValueChange={onValueChange}
          />
        ),
        cta: (
          <Button
            style={ButtonStyle.ghost}
            className="underline"
            text={t(translations.portfolioPage.protocolSection.stakeSOV)}
            onClick={() => navigate('/earn/staking')}
          />
        ),
      },
    ],
    [navigate, selectedCurrency, btcPrice, onValueChange],
  );

  return (
    <>
      {items.map((item, index) => (
        <DepositRow {...item} key={index} />
      ))}
    </>
  );
};
