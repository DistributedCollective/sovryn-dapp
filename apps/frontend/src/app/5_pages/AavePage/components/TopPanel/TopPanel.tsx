import React, { FC } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Heading,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { WalletStatCard } from './components/WalletStatCard/WalletStatCard';

const pageTranslations = translations.aavePage.topPanel;

type TopPanelProps = {};

export const TopPanel: FC<TopPanelProps> = () => {
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
          {/* TODO: mock values */}
          <WalletStatCard
            label={t(pageTranslations.netWorth)}
            prefix="$"
            value={account ? 1234567.58 : undefined}
          />
          <div className="flex gap-9">
            <WalletStatCard
              label={t(pageTranslations.netApy)}
              value={account ? 2.69 : undefined}
              suffix="%"
              helperContent={t(pageTranslations.netApyInfo)}
            />
            <WalletStatCard
              label={t(pageTranslations.collateralRatio)}
              value={account ? 11.5 : undefined}
              suffix="%"
              helperContent={t(pageTranslations.collateralRatioInfo)}
            />
          </div>
        </div>

        <div className="md:flex md:justify-end md:w-full md:items-end md:pb-5">
          <Button
            text="View transactions"
            style={ButtonStyle.secondary}
            size={ButtonSize.small}
          />
        </div>
      </div>
    </div>
  );
};
