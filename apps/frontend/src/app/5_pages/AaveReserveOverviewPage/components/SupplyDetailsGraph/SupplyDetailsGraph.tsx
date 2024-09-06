import React, { FC, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Icon, IconNames, Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { formatAmountWithSuffix } from '../../../../../utils/math';
import { Chart } from './components/Chart/Chart';

const pageTranslations = translations.aaveReserveOverviewPage.supplyDetails;

type SupplyDetailsGraphProps = {
  reserve: Reserve;
};

export const SupplyDetailsGraph: FC<SupplyDetailsGraphProps> = ({
  reserve,
}) => {
  const [open, setOpen] = useState(true);
  const { isMobile } = useIsMobile();

  const totalSupplied = useMemo(() => {
    return Decimal.from(reserve.availableLiquidity).add(reserve.totalDebt);
  }, [reserve]);

  const totalSuppliedUSD = useMemo(() => {
    return Decimal.from(reserve.availableLiquidityUSD).add(
      reserve.totalDebtUSD,
    );
  }, [reserve]);

  const supplyCap = useMemo(() => {
    return Decimal.from(reserve.supplyCap);
  }, [reserve]);

  const supplyCapUSD = useMemo(() => {
    return Decimal.from(reserve.supplyCapUSD);
  }, [reserve]);

  const suppliedPercentage = useMemo(() => {
    return Decimal.from(totalSuppliedUSD)
      .div(Decimal.from(reserve.supplyCapUSD))
      .mul(100)
      .toString(0);
  }, [reserve, totalSuppliedUSD]);

  const maxLTV = useMemo(() => {
    return Decimal.from(reserve.baseLTVasCollateral).div(100);
  }, [reserve]);

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.title)}
        </span>
      }
      className="bg-gray-90 px-4 py-3 rounded lg:p-6 border border-gray-60"
      labelClassName="justify-between flex items-center "
      open={open || !isMobile}
      onClick={setOpen}
      flatMode={!isMobile}
      dataAttribute="supply-details"
    >
      <div className="space-y-8 pt-2">
        <div className="flex gap-8">
          <StatisticsCard
            label={t(pageTranslations.totalSupplied)}
            help={t(pageTranslations.totalSuppliedInfo)}
            value={
              <div>
                <div className="space-x-1 font-medium text-base">
                  <AmountRenderer
                    precision={2}
                    {...formatAmountWithSuffix(totalSupplied)}
                  />
                  {supplyCap.gt(0) && (
                    <>
                      <span>{t(pageTranslations.of)}</span>
                      <AmountRenderer
                        precision={2}
                        {...formatAmountWithSuffix(supplyCap)}
                      />
                    </>
                  )}
                </div>

                <div className="space-x-1 text-gray-40 text-xs font-semibold">
                  <AmountRenderer
                    prefix="$"
                    precision={2}
                    {...formatAmountWithSuffix(totalSuppliedUSD)}
                  />
                  {supplyCap.gt(0) && (
                    <>
                      <span>{t(pageTranslations.of)}</span>
                      <AmountRenderer
                        prefix="$"
                        precision={2}
                        {...formatAmountWithSuffix(supplyCapUSD)}
                      />
                    </>
                  )}
                </div>

                {/* Progress bar */}
                {supplyCap.gt(0) && (
                  <div className="mt-2 h-[3px] w-[160px] bg-gray-70 rounded-full">
                    <div
                      className={`h-full bg-primary-30 w-[${suppliedPercentage}%]`}
                    ></div>
                  </div>
                )}
              </div>
            }
          />
          <StatisticsCard
            label={t(pageTranslations.apy)}
            value={
              <AmountRenderer
                value={reserve.supplyAPY}
                suffix="%"
                precision={2}
              />
            }
          />
        </div>

        <Chart
          input={{
            // TODO: implement once data is available
            data: [],
            label: t(pageTranslations.chart.label1),
            lineColor: theme.colors['primary-30'],
          }}
        />

        <div className="space-y-6">
          {/* collateral usage */}
          <div className="flex gap-8">
            <Paragraph className="text-base">
              {t(pageTranslations.collateralUsage)}
            </Paragraph>
            <div className="flex gap-2 items-center">
              <Icon
                icon={
                  reserve.usageAsCollateralEnabled
                    ? IconNames.CHECK
                    : IconNames.X_MARK
                }
                className={classNames('h-3 w-3', {
                  'text-positive': reserve.usageAsCollateralEnabled,
                  'text-negative': !reserve.usageAsCollateralEnabled,
                })}
                size={16}
              />
              <span className="text-sm text-gray-30">
                {t(
                  reserve.usageAsCollateralEnabled
                    ? pageTranslations.canBeCollateral
                    : pageTranslations.cannotBeCollateral,
                )}
              </span>
            </div>
          </div>

          {/* statistics */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 lg:justify-start lg:gap-8">
            {/* maxLTV */}
            <StatisticsCard
              label={t(pageTranslations.maxLtv)}
              help={t(pageTranslations.maxLtvInfo)}
              value={<AmountRenderer value={maxLTV} suffix="%" precision={2} />}
            />

            {/* liquidation threshold */}
            <StatisticsCard
              label={t(pageTranslations.liquidationThreshold)}
              help={t(pageTranslations.liquidationThresholdInfo)}
              value={
                <AmountRenderer
                  value={reserve.reserveLiquidationThreshold}
                  suffix="%"
                  precision={2}
                />
              }
            />

            {/* liquidation penalty */}
            <StatisticsCard
              label={t(pageTranslations.liquidationPenalty)}
              help={t(pageTranslations.liquidationPenaltyInfo)}
              value={
                <AmountRenderer
                  value={reserve.reserveLiquidationBonus}
                  suffix="%"
                  precision={2}
                />
              }
            />
          </div>
        </div>
      </div>
    </Accordion>
  );
};
