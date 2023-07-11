import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  TOKEN_RENDER_PRECISION,
  VP,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';

export const renderPenaltyAmount = (
  amount: string,
  penaltyAmount: number,
  isValidAmount: boolean,
) => {
  if (!amount || !isValidAmount || penaltyAmount === 0) {
    return t(translations.common.na);
  }

  const penaltyAmountPercentage = Math.ceil(
    (penaltyAmount / Number(amount)) * 100,
  );

  return (
    <AmountRenderer
      value={penaltyAmount}
      suffix={`${SupportedTokens.sov} (${penaltyAmountPercentage}%)`}
      precision={TOKEN_RENDER_PRECISION}
    />
  );
};

export const renderNewStakedAmount = (
  amount: string,
  stakeAmount: string,
  isValidAmount: boolean,
  isDecreaseTab: boolean,
) =>
  decimalic(amount).isZero() || !isValidAmount ? (
    t(translations.common.na)
  ) : (
    <AmountRenderer
      value={
        isDecreaseTab
          ? decimalic(stakeAmount).sub(amount)
          : decimalic(stakeAmount).add(amount)
      }
      suffix={SupportedTokens.sov}
      precision={TOKEN_RENDER_PRECISION}
    />
  );

export const renderVotingPowerChanged = (
  amount: string,
  votingPowerChanged: number,
  isValidAmount: boolean,
  unlockDate: number,
) =>
  decimalic(amount).isZero() || !isValidAmount || unlockDate === 0 ? (
    t(translations.common.na)
  ) : (
    <AmountRenderer
      value={votingPowerChanged}
      suffix={VP}
      precision={TOKEN_RENDER_PRECISION}
    />
  );

export const renderNewVotingPower = (
  amount: string,
  isValidAmount: boolean,
  votingPower: number,
  votingPowerChanged: number,
  isDecreaseTab: boolean,
  unlockDate: number,
) =>
  decimalic(amount).isZero() || !isValidAmount || unlockDate === 0 ? (
    t(translations.common.na)
  ) : (
    <AmountRenderer
      value={
        isDecreaseTab
          ? decimalic(votingPower).sub(votingPowerChanged)
          : decimalic(votingPower).add(votingPowerChanged)
      }
      suffix={VP}
      precision={TOKEN_RENDER_PRECISION}
    />
  );
