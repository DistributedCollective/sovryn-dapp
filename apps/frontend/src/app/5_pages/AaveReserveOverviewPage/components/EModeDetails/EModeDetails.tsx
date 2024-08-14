import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Icon, Link, Paragraph } from '@sovryn/ui';

import { EModeIcon } from '../../../../1_atoms/Icons/Icons';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.aaveReserveOverviewPage.eModeDetails;

type EModeDetailsProps = {};

export const EModeDetails: FC<EModeDetailsProps> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { isMobile } = useIsMobile();

  // TODO: All this data is mocked
  const maxLtv = 93;
  const liquidationThreshold = 94;
  const liquidationPenalty = 1;

  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.title)}
        </span>
      }
      className="bg-gray-90 px-4 py-3 rounded lg:p-6 border border-gray-60 grid grid-cols-1 lg:grid-cols-[170px_auto]"
      labelClassName="justify-between  h-7 flex items-center"
      open={open || !isMobile}
      onClick={setOpen}
      flatMode={!isMobile}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center max-w-[260px]">
          <Paragraph className="text-sm font-medium">
            {t(pageTranslations.category)}
          </Paragraph>
          <Paragraph className="text-sm font-medium flex items-center">
            <Icon size={16} className="mr-2 text-primary-30" icon={EModeIcon} />
            {t(pageTranslations.ethCorrelatedCategory)}
          </Paragraph>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <StatisticsCard
            label={t(pageTranslations.maxLtv)}
            amountRendererClassName="text-base shrink-0"
            className="space-y-2"
            helperContent={t(pageTranslations.maxLtvInfo)}
            value={maxLtv}
            suffix="%"
          />
          <StatisticsCard
            label={t(pageTranslations.liquidationThreshold)}
            amountRendererClassName="text-base shrink-0"
            className="space-y-2 "
            helperContent={t(pageTranslations.liquidationThresholdInfo)}
            value={liquidationThreshold}
            suffix="%"
          />
          <StatisticsCard
            label={t(pageTranslations.liquidationPenalty)}
            amountRendererClassName="text-base shrink-0"
            className="space-y-2"
            helperContent={t(pageTranslations.liquidationPenaltyInfo)}
            value={liquidationPenalty}
            suffix="%"
          />
        </div>

        <div>
          <Paragraph className="text-gray-30">
            {t(pageTranslations.body)}
          </Paragraph>
          <Link href="#learn-more" text={t(pageTranslations.learnMore)} />
        </div>
      </div>
    </Accordion>
  );
};
