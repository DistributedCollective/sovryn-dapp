import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Icon, Link, Paragraph } from '@sovryn/ui';

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
        <div className="flex justify-between items-center">
          <Paragraph className="text-sm font-medium">
            {t(pageTranslations.category)}
          </Paragraph>
          <Paragraph className="text-sm font-medium flex items-center">
            <Icon
              size={16}
              className="mr-2"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.78855 9.33172C2.68495 9.33172 2.62901 9.21023 2.69637 9.13151L9.96892 0.632031C10.0508 0.536295 10.2063 0.613419 10.1797 0.736569L8.89046 6.695C8.87411 6.7706 8.9317 6.84199 9.00905 6.84199L13.8675 6.84199C13.9755 6.84199 14.0296 6.97243 13.9535 7.04893L5.54013 15.4971C5.44923 15.5884 5.29749 15.4938 5.33946 15.372L7.36524 9.49257C7.39238 9.41378 7.33385 9.33172 7.25053 9.33172H2.78855Z"
                    fill="#F58C31"
                  />
                </svg>
              }
            />
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
