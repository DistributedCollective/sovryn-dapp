import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Heading,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  Tooltip,
  TooltipPlacement,
  TooltipTrigger,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { WalletIcon } from '../../../../1_atoms/Icons/Icons';
import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { useAddTokenToWallet } from '../../../../../hooks/useAddTokenToWallet';
import { translations } from '../../../../../locales/i18n';
import { getBobExplorerUrl } from '../../../../../utils/helpers';
import { formatAmountWithSuffix } from '../../../../../utils/math';
import { ReserveTokens } from './components/ReserveTokens/ReserveTokens';

const pageTranslations = translations.aaveReserveOverviewPage.topPanel;

export type ReserveOverview = {
  symbol: string;
  name: string;
  underlyingAsset: string;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  stableDebtTokenAddress: string;
  reserveSize: Decimal;
  availableLiquidity: Decimal;
  utilizationRate: Decimal;
  oraclePrice: Decimal;
  oracleAddress: string;
};

type TopPanelProps = {
  reserve: Reserve;
  className?: string;
};

export const TopPanel: FC<TopPanelProps> = ({ reserve, className }) => {
  const { addTokenToWallet } = useAddTokenToWallet(BOB_CHAIN_ID);

  const openInExplorer = useCallback((tokenAddress: string) => {
    const explorer = getBobExplorerUrl();
    window.open(`${explorer}/address/${tokenAddress}`, '_blank');
  }, []);

  const oracleLink = useMemo(
    () => getBobExplorerUrl() + '/address/' + reserve.priceOracle,
    [reserve.priceOracle],
  );

  const reserveSize = useMemo(
    () => Decimal.from(reserve.availableLiquidityUSD).add(reserve.totalDebtUSD),
    [reserve],
  );

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

      <div className="gap-6 lg:gap-9 flex-shrink-0 grid grid-cols-2 lg:flex">
        <div className="col-span-2 flex items-center lg:items-start gap-3">
          <div className="flex items-center gap-1">
            <AssetRenderer
              asset={reserve.symbol}
              chainId={BOB_CHAIN_ID}
              showAssetLogo
              assetClassName="text-base"
              logoClassName="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:mr-[10px]"
            />
            <span className="text-gray-40 text-base font-medium">
              {reserve.name}
            </span>
          </div>

          <div className="flex items-center gap-3 h-8">
            {/* show token in explorer */}
            <Tooltip
              tooltipClassName="py-1 px-0"
              trigger={TooltipTrigger.hover}
              placement={TooltipPlacement.bottom}
              content={
                <ReserveTokens
                  className="w-60"
                  symbol={reserve.symbol}
                  aTokenAddress={reserve.aTokenAddress}
                  underlyingTokenAddress={reserve.underlyingAsset}
                  variableDebtTokenAddress={reserve.variableDebtTokenAddress}
                  stableDebtTokenAddress={reserve.stableDebtTokenAddress}
                  onTokenClick={openInExplorer}
                />
              }
            >
              <div>
                <Icon
                  icon={IconNames.NEW_TAB}
                  className="text-gray-30 cursor-pointer"
                  size={16}
                />
              </div>
            </Tooltip>

            {/* add token to wallet */}
            <Tooltip
              tooltipClassName="py-1 px-0"
              trigger={TooltipTrigger.hover}
              placement={TooltipPlacement.bottom}
              content={
                <ReserveTokens
                  className="w-60"
                  symbol={reserve.symbol}
                  aTokenAddress={reserve.aTokenAddress}
                  underlyingTokenAddress={reserve.underlyingAsset}
                  variableDebtTokenAddress={reserve.variableDebtTokenAddress}
                  stableDebtTokenAddress={reserve.stableDebtTokenAddress}
                  onTokenClick={addTokenToWallet}
                />
              }
            >
              <div>
                <Icon
                  icon={WalletIcon}
                  className="text-gray-30 cursor-pointer"
                  size={16}
                />
              </div>
            </Tooltip>
          </div>
        </div>

        <StatisticsCard
          label={t(pageTranslations.reserveSize)}
          value={
            <AmountRenderer
              prefix="$"
              className="text-2xl"
              {...formatAmountWithSuffix(reserveSize)}
            />
          }
        />
        <StatisticsCard
          label={t(pageTranslations.availableLiquidity)}
          value={
            <AmountRenderer
              prefix="$"
              className="text-2xl"
              {...formatAmountWithSuffix(reserve.formattedAvailableLiquidity)}
            />
          }
        />
        <StatisticsCard
          label={t(pageTranslations.utilizationRate)}
          value={
            <AmountRenderer
              suffix="%"
              value={reserve.borrowUsageRatio}
              precision={2}
              className="text-2xl"
            />
          }
        />
        <StatisticsCard
          label={t(pageTranslations.oraclePrice)}
          link={oracleLink}
          value={
            <AmountRenderer
              prefix="$"
              value={reserve.priceInUSD}
              precision={2}
              className="text-2xl"
            />
          }
        />
      </div>
    </div>
  );
};
