import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';
import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.aavePage.topPanel;

type TopPanelProps = {
  netWorth: Decimalish;
  netApy: Decimalish;
  healthFactor: Decimalish;
};

export const TopPanel: FC<TopPanelProps> = ({
  netApy,
  netWorth,
  healthFactor,
}) => {
  const { account } = useAccount();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center py-6 px-10 space-y-3 md:hidden">
        <Heading className="text-base leading-5">
          {t(pageTranslations.title)}
        </Heading>
        <Paragraph size={ParagraphSize.base}>
          {t(pageTranslations.subtitle)}
        </Paragraph>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-4 md:py-12 md:flex-row md:gap-9 flex-shrink-0">
          <StatisticsCard
            label={t(pageTranslations.netWorth)}
            value={
              account ? (
                <AmountRenderer
                  prefix="$"
                  precision={2}
                  value={netWorth}
                  className="text-2xl"
                />
              ) : undefined
            }
          />
          <div className="flex gap-9">
            <StatisticsCard
              label={t(pageTranslations.netApy)}
              value={
                account ? (
                  <AmountRenderer
                    suffix="%"
                    value={netApy}
                    precision={2}
                    className="text-2xl"
                  />
                ) : undefined
              }
              help={t(pageTranslations.netApyInfo)}
            />
            <StatisticsCard
              label={t(pageTranslations.healthFactor)}
              value={
                account ? (
                  <AmountRenderer
                    suffix="%"
                    precision={2}
                    value={healthFactor}
                    className="text-2xl"
                  />
                ) : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
