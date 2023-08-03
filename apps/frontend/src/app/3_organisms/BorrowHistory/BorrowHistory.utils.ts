import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { BorrowHistoryType } from './BorrowHistory.types';

export const borrowHistoryOptions = [
  {
    value: BorrowHistoryType.lineOfCredit,
    label: t(translations.borrowHistory.types.lineOfCredit),
  },
  {
    value: BorrowHistoryType.fixedInterestLoan,
    label: t(translations.borrowHistory.types.fixedInterestLoan),
  },
  {
    value: BorrowHistoryType.collateralSurplus,
    label: t(translations.borrowHistory.types.collateralSurplus),
  },
];
