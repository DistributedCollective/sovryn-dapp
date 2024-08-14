import React, { FC } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Heading, Icon, Paragraph, ParagraphSize } from '@sovryn/ui';

import { LinkIcon, WalletIcon } from '../../../../1_atoms/Icons/Icons';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.aaveReserveOverviewPage.topPanel;

type TopPanelProps = {
  asset: {
    name: string;
    symbol: string;
  };
  className?: string;
};

export const TopPanel: FC<TopPanelProps> = ({ asset, className }) => {
  // TODO: Mocked data
  const reserveSizeInM = 1234.58;
  const availableLiquidityM = 1234.58;
  const utilizationRate = 2.79;
  const oraclePrice = 11.5;

  return (
    <div className={classNames('w-full flex flex-col gap-6', className)}>
      <div className="text-center py-6 px-10 space-y-3 lg:hidden">
        <Heading className="text-base leading-5">
          {t(pageTranslations.title)}
        </Heading>
        <Paragraph size={ParagraphSize.base}>
          {t(pageTranslations.subtitle)}
        </Paragraph>
      </div>

      <div className="gap-6 lg:gap-9 flex-shrink-0 grid grid-cols-2 lg:flex max-w-3xl">
        <div className="col-span-2 flex items-center lg:items-start gap-3">
          <div className="flex items-center gap-1">
            <AssetRenderer
              asset={asset.symbol}
              showAssetLogo
              assetClassName="text-base"
              logoClassName="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:mr-[10px]"
            />
            <span className="text-gray-40 text-base font-medium">
              {asset.name}
            </span>
          </div>

          <div className="flex items-center gap-2 h-8">
            <a href="#block-explorer">
              <Icon icon={LinkIcon} className="text-gray-30" size={16} />
            </a>
            <a href="#block-explorer">
              <Icon icon={WalletIcon} className="text-gray-30" size={16} />
            </a>
          </div>
        </div>

        <StatisticsCard
          label={t(pageTranslations.reserveSize)}
          prefix="$"
          suffix="M"
          value={reserveSizeInM}
        />
        <StatisticsCard
          label={t(pageTranslations.availableLiquidity)}
          prefix="$"
          suffix="M"
          value={availableLiquidityM}
        />
        <StatisticsCard
          label={t(pageTranslations.utilizationRate)}
          value={utilizationRate}
          suffix="%"
        />
        <StatisticsCard
          label={t(pageTranslations.oraclePrice)}
          value={oraclePrice}
          prefix="$"
          link="#oracle-price"
        />
      </div>
    </div>
  );
};
