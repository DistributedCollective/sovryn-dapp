import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BTC_RENDER_PRECISION } from '../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { DepositRow } from './components/DepositRow/DepositRow';

export const ProtocolSection: FC = () => {
  const navigate = useNavigate();
  const items = useMemo(
    () => [
      {
        title: t(translations.portfolioPage.protocolSection.marketMaking),
        value: (
          <AmountRenderer
            value="1.23456789213123"
            suffix={getTokenDisplayName(SupportedTokens.rbtc)}
            precision={BTC_RENDER_PRECISION}
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
            suffix={getTokenDisplayName(SupportedTokens.rbtc)}
            precision={BTC_RENDER_PRECISION}
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
            suffix={getTokenDisplayName(SupportedTokens.rbtc)}
            precision={BTC_RENDER_PRECISION}
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
            suffix={getTokenDisplayName(SupportedTokens.rbtc)}
            precision={BTC_RENDER_PRECISION}
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
            suffix={getTokenDisplayName(SupportedTokens.rbtc)}
            precision={BTC_RENDER_PRECISION}
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
    [navigate],
  );
  return (
    <div className="flex flex-col gap-3">
      <Paragraph className="text-right text-gray-30 font-medium">
        {t(translations.portfolioPage.protocolSection.depositValue)}
      </Paragraph>
      {items.map(item => (
        <DepositRow {...item} />
      ))}
    </div>
  );
};
