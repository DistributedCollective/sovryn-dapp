import { TxStep } from '@sovryn/sdk';
import { StatusType } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

const translation = translations.erc20Bridge.confirmationScreens;

export const getStatus = (step: TxStep) => {
  switch (step) {
    case TxStep.APPROVING:
      return {
        title: translation.statusApprovalProcessing,
        status: StatusType.pending,
      };
    case TxStep.PENDING:
    case TxStep.CONFIRMING:
      return {
        title: translation.statusTitleProcessing,
        status: StatusType.pending,
      };

    case TxStep.USER_DENIED:
    case TxStep.FAILED:
      return {
        title: translation.statusTitleFailed,
        status: StatusType.error,
      };

    case TxStep.CONFIRMED:
      return {
        title: translation.statusTitleComplete,
        status: StatusType.success,
      };

    default:
      return {
        title: translation.reviewTitle,
      };
  }
};
