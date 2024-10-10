import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { EarnHistoryType } from './EarnHistory.types';

export const EARN_HISTORY_OPTIONS = (isBobChain: boolean) =>
  isBobChain
    ? [
        {
          value: EarnHistoryType.lending,
          label: t(translations.earnHistory.types.lending),
        },
        {
          value: EarnHistoryType.marketMaking,
          label: t(translations.earnHistory.types.marketMaking),
        },
      ]
    : [
        {
          value: EarnHistoryType.stabilityPool,
          label: t(translations.earnHistory.types.stabilityPool),
        },
        {
          value: EarnHistoryType.lending,
          label: t(translations.earnHistory.types.lending),
        },
        {
          value: EarnHistoryType.marketMaking,
          label: t(translations.earnHistory.types.marketMaking),
        },
      ];
