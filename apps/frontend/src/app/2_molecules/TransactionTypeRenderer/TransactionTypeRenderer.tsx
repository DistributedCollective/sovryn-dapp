import React, { FC, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { translations } from '../../../locales/i18n';
import { StabilityDepositOperation } from '../../../utils/graphql/zero/generated';

type TransactionTypeRendererProps = {
  type: StabilityDepositOperation;
};

export const TransactionTypeRenderer: FC<TransactionTypeRendererProps> = ({
  type,
}) => {
  const { t } = useTranslation();
  const getTransactionType = useCallback(
    (operation: StabilityDepositOperation) => {
      switch (operation) {
        case StabilityDepositOperation.DepositTokens:
          return t(
            translations.stabilityPoolHistory.stabilityPoolOperation.deposit,
          );
        case StabilityDepositOperation.WithdrawTokens:
          return t(
            translations.stabilityPoolHistory.stabilityPoolOperation.withdrawal,
          );
        case StabilityDepositOperation.WithdrawCollateralGain:
          return t(
            translations.stabilityPoolHistory.stabilityPoolOperation
              .withdrawCollateralGain,
          );
        case StabilityDepositOperation.WithdrawGainToLineOfCredit:
          return t(
            translations.stabilityPoolHistory.stabilityPoolOperation
              .withdrawGainToLineOfCredit,
          );
        default:
          return operation;
      }
    },
    [t],
  );

  return <>{getTransactionType(type)}</>;
};
