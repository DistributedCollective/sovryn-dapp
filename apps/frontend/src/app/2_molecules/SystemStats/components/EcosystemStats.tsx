import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import {
  applyDataAttr,
  Icon,
  Paragraph,
  ParagraphSize,
  ParagraphStyle,
  SimpleTable,
  SimpleTableRow,
  Tooltip,
} from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';

type EcosystemStatsProps = {
  className?: string;
  dataAttribute?: string;
};

export const EcosystemStats: FC<EcosystemStatsProps> = ({
  className,
  dataAttribute,
}) => {
  const { t } = useTranslation();
  return (
    <div className={className} {...applyDataAttr(dataAttribute)}>
      <Paragraph
        size={ParagraphSize.base}
        style={ParagraphStyle.normal}
        className="mb-6"
      >
        {t(translations.stats.ecosystem.title)}
      </Paragraph>
      <SimpleTable
        dataLayoutId="system-statistics"
        className="max-w-[23.125rem]"
      >
        <SimpleTableRow
          className="mb-8"
          label={
            <div className="flex items-center">
              {t(translations.stats.ecosystem.babelFishZUSDBalance)}
              <Tooltip
                className="ml-2"
                content={t(translations.stats.ecosystem.babelFishZUSDBalance)}
                dataLayoutId="system-statistics-tooltip-rbtc-in-loc"
              >
                <div>
                  <Icon size={12} icon="info" />
                </div>
              </Tooltip>
            </div>
          }
          value="0"
        />
        <SimpleTableRow
          className="mb-8"
          label={t(translations.stats.ecosystem.babelFishDLLRBalance)}
          value="0"
        />
        <SimpleTableRow
          className="mb-8"
          label={t(translations.stats.ecosystem.myntZUSDBalance)}
          value="0"
        />
        <SimpleTableRow
          className="mb-8"
          label={t(translations.stats.ecosystem.myntDOCBalance)}
          value="0"
        />
        <SimpleTableRow
          label={t(translations.stats.ecosystem.totalDLLRSupply)}
          value="0"
        />
      </SimpleTable>
    </div>
  );
};
