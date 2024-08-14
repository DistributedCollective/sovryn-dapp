import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Link } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.aaveReserveOverviewPage.interestRateModel;

type InterestRateModelGraphProps = {};

// TODO: mocked amounts

export const InterestRateModelGraph: FC<InterestRateModelGraphProps> = () => {
  const [open, setOpen] = useState<boolean>(true);
  const { isMobile } = useIsMobile();

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
        <div className="flex justify-between items-end">
          <StatisticsCard
            label={t(pageTranslations.utilizationRate)}
            value={<AmountRenderer value={5.94} suffix="%" />}
          />
          <Link href="#" text={t(pageTranslations.interestRateStrategy)} />
        </div>

        <div className="h-10 bg-blue-2">
          <span>TODO: Graph</span>
        </div>
      </div>
    </Accordion>
  );
};
