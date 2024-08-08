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

import { translations } from '../../../../../locales/i18n';
import { WalletStatCard } from '../WalletStatCard/WalletStatCard';

const pageTranslations = translations.aavePage.topPanel;

type TopPanelProps = {
  account: string;
};

export const TopPanel: FC<TopPanelProps> = ({ account }) => {
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
          <WalletStatCard
            label={t(pageTranslations.netWorth)}
            prefix="$"
            value="1,234,567.58"
            tooltipContent="Net APY is the combined effect of all supply and borrow positions on net worth, including incentives. It is possible to have a negative net APY if debt APY is higher than supply APY."
          />
          <div className="flex gap-9">
            <WalletStatCard
              label={t(pageTranslations.netWorth)}
              value="200"
              suffix="%"
              tooltipContent="Net APY is the combined effect of all supply and borrow positions on net worth, including incentives. It is possible to have a negative net APY if debt APY is higher than supply APY."
            />
            <WalletStatCard
              label={t(pageTranslations.netWorth)}
              value="11.69"
              suffix="%"
              tooltipContent="Net APY is the combined effect of all supply and borrow positions on net worth, including incentives. It is possible to have a negative net APY if debt APY is higher than supply APY."
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
