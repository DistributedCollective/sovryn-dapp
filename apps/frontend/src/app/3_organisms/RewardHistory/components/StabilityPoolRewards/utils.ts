import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { StabilityDepositOperation } from '../../../../../utils/graphql/zero/generated';

export const getTransactionType = (operation: StabilityDepositOperation) => {
  switch (operation) {
    case StabilityDepositOperation.WithdrawCollateralGain:
      return t(
        translations.rewardHistory.stabilityPoolOperation.claimCollateralGain,
      );
    case StabilityDepositOperation.WithdrawGainToLineOfCredit:
      return t(
        translations.rewardHistory.stabilityPoolOperation
          .transferGainToLineOfCredit,
      );
    default:
      return operation;
  }
};
