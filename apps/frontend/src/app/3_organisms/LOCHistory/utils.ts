import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { LOCHistoryType } from './types';

export const locHistoryOptions = [
  {
    value: LOCHistoryType.lineOfCredit,
    label: t(translations.locHistory.types.lineOfCredit),
  },
  {
    value: LOCHistoryType.collateralSurplus,
    label: t(translations.locHistory.types.collateralSurplus),
  },
];
