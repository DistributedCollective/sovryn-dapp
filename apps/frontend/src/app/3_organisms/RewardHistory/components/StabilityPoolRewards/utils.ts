import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { BTC_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { StabilityDepositOperation } from '../../../../../utils/graphql/zero/generated';
import { formatValue } from '../../../../../utils/math';

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

export const renderCollateralChange = (collateralGain: string) =>
  `${formatValue(
    Math.abs(Number(collateralGain)),
    BTC_RENDER_PRECISION,
  )} ${SupportedTokens.rbtc.toUpperCase()}`;
