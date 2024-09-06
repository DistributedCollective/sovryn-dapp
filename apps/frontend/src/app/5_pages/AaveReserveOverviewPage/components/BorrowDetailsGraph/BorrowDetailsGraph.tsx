import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Link, Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { config } from '../../../../../constants/aave';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { FormattedReserveHistoryItem } from '../../../../../hooks/aave/useReservesHistory';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { getBobExplorerUrl } from '../../../../../utils/helpers';
import { formatAmountWithSuffix } from '../../../../../utils/math';
import { Chart } from './components/Chart/Chart';

const pageTranslations = translations.aaveReserveOverviewPage.borrowDetails;

type BorrowDetailsGraphProps = {
  history: FormattedReserveHistoryItem[];
  reserve: Reserve;
};

export const BorrowDetailsGraph: FC<BorrowDetailsGraphProps> = ({
  reserve,
  history,
}) => {
  const [open, setOpen] = useState(true);
  const { isMobile } = useIsMobile();

  const inputData = useMemo(() => {
    const data = history.map(i => ({
      x: i.date,
      y: i.variableBorrowRate * 100,
    }));
    return {
      data,
      label: t(pageTranslations.chart.label1),
      lineColor: theme.colors['primary-30'],
    };
  }, [history]);

  const totalBorrowed = useMemo(() => {
    return Decimal.from(reserve.totalDebt);
  }, [reserve]);

  const totalBorrowedUSD = useMemo(() => {
    return Decimal.from(reserve.totalDebtUSD);
  }, [reserve]);

  const debtCap = useMemo(() => {
    return Decimal.from(reserve.debtCeiling);
  }, [reserve]);

  const debtCapUSD = useMemo(() => {
    return Decimal.from(reserve.debtCeilingUSD);
  }, [reserve]);

  const borrowedPercentage = useMemo(() => {
    return Decimal.from(totalBorrowedUSD)
      .div(Decimal.from(reserve.debtCeilingUSD))
      .mul(100)
      .toString(0);
  }, [reserve, totalBorrowedUSD]);

  const collectorContractLink = useMemo(() => {
    return `${getBobExplorerUrl()}/address/${config.TreasuryAddress}`;
  }, []);

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
    >
      <div className="space-y-8 pt-2">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 ">
          <StatisticsCard
            label={t(pageTranslations.totalBorrowed)}
            help={t(pageTranslations.totalBorrowedInfo)}
            value={
              <div>
                <div className="space-x-1 font-medium text-base">
                  <AmountRenderer
                    precision={2}
                    {...formatAmountWithSuffix(totalBorrowed)}
                  />
                  {debtCap.gt(0) && (
                    <>
                      <span>{t(pageTranslations.of)}</span>
                      <AmountRenderer
                        precision={2}
                        {...formatAmountWithSuffix(debtCap)}
                      />
                    </>
                  )}
                </div>

                <div className="space-x-1 text-gray-40 text-xs font-semibold">
                  <AmountRenderer
                    prefix="$"
                    precision={2}
                    {...formatAmountWithSuffix(totalBorrowedUSD)}
                  />
                  {debtCap.gt(0) && (
                    <>
                      <span>{t(pageTranslations.of)}</span>
                      <AmountRenderer
                        prefix="$"
                        precision={2}
                        {...formatAmountWithSuffix(debtCapUSD)}
                      />
                    </>
                  )}
                </div>

                {/* Progress bar */}
                {debtCap.gt(0) && (
                  <div className="mt-2 h-[3px] w-[160px] bg-gray-70 rounded-full">
                    <div
                      className={`h-full bg-primary-30 w-[${borrowedPercentage}%]`}
                    ></div>
                  </div>
                )}
              </div>
            }
          />
          <div className="flex gap-8">
            <StatisticsCard
              label={t(pageTranslations.apr)}
              value={
                <AmountRenderer
                  value={reserve.variableBorrowAPR}
                  suffix="%"
                  precision={2}
                />
              }
            />

            {debtCap.gt(0) && (
              <StatisticsCard
                label={t(pageTranslations.borrowCap)}
                value={
                  <AmountRenderer
                    precision={2}
                    {...formatAmountWithSuffix(debtCap)}
                  />
                }
              />
            )}
          </div>
        </div>

        <Chart input={inputData} />

        <div className="space-y-6">
          <Paragraph className="text-base">
            {t(pageTranslations.collectorInfo)}
          </Paragraph>

          {/* reserve factor */}
          <div className="flex gap-8">
            <StatisticsCard
              label={t(pageTranslations.reserveFactor)}
              help={t(pageTranslations.reserveFactorInfo)}
              value={
                <AmountRenderer
                  value={reserve.reserveFactor}
                  precision={2}
                  suffix="%"
                />
              }
            />

            <StatisticsCard
              label={t(pageTranslations.collectorContract)}
              value={
                <Link
                  openNewTab
                  href={collectorContractLink}
                  text={t(pageTranslations.viewContract)}
                />
              }
            />
          </div>
        </div>
      </div>
    </Accordion>
  );
};
