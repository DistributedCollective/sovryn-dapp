import React, { FC } from 'react';

import { t } from 'i18next';

import { translations } from '../../../locales/i18n';

export const DeprecatedBadge: FC = () => {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-10 font-medium text-[10px] border border-primary-30 rounded-sm px-1 py-0.5">
        {t(translations.ambientMarketMaking.deprecated)}
      </span>
    </div>
  );
};
