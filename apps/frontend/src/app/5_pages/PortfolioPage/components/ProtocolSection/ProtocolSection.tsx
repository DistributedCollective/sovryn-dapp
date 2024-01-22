import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { DepositRow } from './components/DepositRow/DepositRow';
import { ProtocolTvlSection } from './components/ProtocolTvlSection/ProtocolTvlSection';

export const ProtocolSection: FC = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState(BITCOIN);

  const handleCurrencyChange = useCallback((currency: string) => {
    setSelectedCurrency(currency);
  }, []);

  const renderCurrencyPrecision = useMemo(
    () =>
      selectedCurrency === BITCOIN
        ? BTC_RENDER_PRECISION
        : TOKEN_RENDER_PRECISION,
    [selectedCurrency],
  );

  const items = useMemo(
    () => [
      {
        title: t(translations.portfolioPage.protocolSection.marketMaking),
        value: (
          <AmountRenderer
            value="1.23456789213123"
            suffix={selectedCurrency}
            precision={renderCurrencyPrecision}
            isAnimated
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
          <AmountRenderer
            value="1.23456789213123"
            suffix={selectedCurrency}
            precision={renderCurrencyPrecision}
            isAnimated
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
          <AmountRenderer
            value="1.23456789213123"
            suffix={selectedCurrency}
            precision={renderCurrencyPrecision}
            isAnimated
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
          <AmountRenderer
            value="0"
            suffix={selectedCurrency}
            precision={renderCurrencyPrecision}
            isAnimated
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
          <AmountRenderer
            value="1.23456789213123"
            suffix={selectedCurrency}
            precision={renderCurrencyPrecision}
            isAnimated
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
    [navigate, renderCurrencyPrecision, selectedCurrency],
  );

  return (
    <div className="flex flex-col gap-3">
      <ProtocolTvlSection
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
      />
      <Paragraph className="text-right text-gray-30 font-medium">
        {t(translations.portfolioPage.protocolSection.depositValue)}
      </Paragraph>
      {items.map(item => (
        <DepositRow {...item} key={item.title} />
      ))}
    </div>
  );
};
