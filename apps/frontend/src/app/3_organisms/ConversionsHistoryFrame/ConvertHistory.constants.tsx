import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { ConvertHistoryType } from './ConvertHistory.types';

export const CONVERT_HISTORY_OPTIONS = [
  {
    value: ConvertHistoryType.AMM,
    label: t(translations.conversionsHistory.types.AMM),
  },
  {
    value: ConvertHistoryType.BOB,
    label: t(translations.conversionsHistory.types.BOB),
  },
  //TODO: requires adding the data to the subgraph
  // {
  //   value: ConvertHistoryType.MOC,
  //   label: t(translations.conversionsHistory.types.MOC),
  // },
  {
    value: ConvertHistoryType.MYNT,
    label: t(translations.conversionsHistory.types.Mynt),
  },
  {
    value: ConvertHistoryType.ZERO,
    label: t(translations.conversionsHistory.types.Zero),
  },
];
