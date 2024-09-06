import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Icon, Link, Paragraph } from '@sovryn/ui';

import { EModeIcon } from '../../../../1_atoms/Icons/Icons';
import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { normalizeEModeStats } from './EModeDetails.utils';

const pageTranslations = translations.aaveReserveOverviewPage.eModeDetails;

export type EModeDetailsProps = {
  reserve: Reserve;
};

export const EModeDetails: FC<EModeDetailsProps> = ({ reserve }) => {
  const [open, setOpen] = useState(true);
  const { isMobile } = useIsMobile();

  const eModeStats = useMemo(() => {
    return normalizeEModeStats(reserve);
  }, [reserve]);

  if (!eModeStats.enabled) return null;
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
      dataAttribute="e-mode"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center max-w-[260px]">
          <Paragraph className="text-sm font-medium">
            {t(pageTranslations.category)}
          </Paragraph>
          <div className="flex items-center">
            <Icon size={16} className="mr-2 text-primary-30" icon={EModeIcon} />
            <Paragraph className="text-sm font-medium">
              {eModeStats.label}
            </Paragraph>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <StatisticsCard
            label={t(pageTranslations.maxLtv)}
            className="space-y-2"
            help={t(pageTranslations.maxLtvInfo)}
            value={
              <AmountRenderer value={eModeStats.ltv} suffix="%" precision={2} />
            }
          />
          <StatisticsCard
            label={t(pageTranslations.liquidationThreshold)}
            className="space-y-2 "
            help={t(pageTranslations.liquidationThresholdInfo)}
            value={
              <AmountRenderer
                value={eModeStats.liquidationThreshold}
                suffix="%"
                precision={2}
              />
            }
          />
          <StatisticsCard
            label={t(pageTranslations.liquidationPenalty)}
            className="space-y-2"
            help={t(pageTranslations.liquidationPenaltyInfo)}
            value={
              <AmountRenderer
                value={eModeStats.liquidationPenalty}
                suffix="%"
                precision={2}
              />
            }
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
