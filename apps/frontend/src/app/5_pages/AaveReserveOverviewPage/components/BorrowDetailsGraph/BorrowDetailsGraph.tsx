import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Link, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { formatAmountWithSuffix } from '../../../../../utils/math';
import { normalizeBorrowStats } from './BorrowDetailsGraph.utils';
import { Chart } from './components/Chart/Chart';

const pageTranslations = translations.aaveReserveOverviewPage.borrowDetails;

type BorrowDetailsGraphProps = {
  reserve: Reserve;
};

export const BorrowDetailsGraph: FC<BorrowDetailsGraphProps> = ({
  reserve,
}) => {
  const { isMobile } = useIsMobile();
  const [open, setOpen] = useState(true);

  const borrowStats = useMemo(() => normalizeBorrowStats(reserve), [reserve]);

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
                    {...formatAmountWithSuffix(borrowStats.totalBorrowed)}
                  />
                  {borrowStats.borrowCap.gt(0) && (
                    <>
                      <span>{t(pageTranslations.of)}</span>
                      <AmountRenderer
                        precision={2}
                        {...formatAmountWithSuffix(borrowStats.borrowCap)}
                      />
                    </>
                  )}
                </div>

                <div className="space-x-1 text-gray-40 text-xs font-semibold">
                  <AmountRenderer
                    prefix="$"
                    precision={2}
                    {...formatAmountWithSuffix(borrowStats.totalBorrowedUSD)}
                  />
                  {borrowStats.borrowCap.gt(0) && (
                    <>
                      <span>{t(pageTranslations.of)}</span>
                      <AmountRenderer
                        prefix="$"
                        precision={2}
                        {...formatAmountWithSuffix(borrowStats.borrowCapUSD)}
                      />
                    </>
                  )}
                </div>

                {/* Progress bar */}
                {borrowStats.borrowCap.gt(0) && (
                  <div className="mt-2 h-[3px] w-[160px] bg-gray-70 rounded-full">
                    <div
                      className={`h-full bg-primary-30 w-[${borrowStats.borrowedPercentage.toString(
                        0,
                      )}%]`}
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
                  value={borrowStats.apr}
                  suffix="%"
                  precision={2}
                />
              }
            />

            {borrowStats.borrowCap.gt(0) && (
              <StatisticsCard
                label={t(pageTranslations.borrowCap)}
                value={
                  <AmountRenderer
                    precision={2}
                    {...formatAmountWithSuffix(borrowStats.borrowCap)}
                  />
                }
              />
            )}
          </div>
        </div>

        <Chart
          input={{
            // TODO: implement once data is available
            data: [],
            label: '',
            lineColor: theme.colors.primary[30],
          }}
        />

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
                  value={borrowStats.reserveFactor}
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
                  href={borrowStats.collectorContractLink}
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
