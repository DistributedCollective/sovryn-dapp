import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';

import { translations } from '../../../locales/i18n';
import { isBobChain } from '../../../utils/chain';
import { BorrowHistoryType } from './BorrowHistory.types';

export const BORROW_HISTORY_OPTIONS = (chainId: ChainId) =>
  isBobChain(chainId)
    ? [
        {
          value: BorrowHistoryType.newLoan,
          label: t(translations.borrowHistory.types.newLoan),
        },
        {
          value: BorrowHistoryType.closeWithDepositLoan,
          label: t(translations.borrowHistory.types.closeWithDepositLoan),
        },
        {
          value: BorrowHistoryType.liquidationLoan,
          label: t(translations.borrowHistory.types.liquidationLoan),
        },
        {
          value: BorrowHistoryType.swapBorrowRateMode,
          label: t(translations.borrowHistory.types.swapBorrowRateMode),
        },
      ]
    : [
        {
          value: BorrowHistoryType.lineOfCredit,
          label: t(translations.borrowHistory.types.lineOfCredit),
        },
        {
          value: BorrowHistoryType.newLoan,
          label: t(translations.borrowHistory.types.newLoan),
        },
        {
          value: BorrowHistoryType.depositCollateralLoan,
          label: t(translations.borrowHistory.types.depositCollateralLoan),
        },
        {
          value: BorrowHistoryType.closeWithSwapLoan,
          label: t(translations.borrowHistory.types.closeWithSwapLoan),
        },
        {
          value: BorrowHistoryType.closeWithDepositLoan,
          label: t(translations.borrowHistory.types.closeWithDepositLoan),
        },
        {
          value: BorrowHistoryType.liquidationLoan,
          label: t(translations.borrowHistory.types.liquidationLoan),
        },
        {
          value: BorrowHistoryType.rolloversLoan,
          label: t(translations.borrowHistory.types.rolloversLoan),
        },
        {
          value: BorrowHistoryType.collateralSurplus,
          label: t(translations.borrowHistory.types.collateralSurplus),
        },
      ];
