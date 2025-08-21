import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { VP } from '../../../../5_pages/StakePage/StakePage.constants';
import { AdjustStakeAction } from '../../../../5_pages/StakePage/StakePage.types';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { decimalic } from '../../../../../utils/math';

export const renderPenaltyAmount = (
  amount: string,
  penaltyAmount: string,
  isValidAmount: boolean,
) => {
  if (
    !isValidAmount ||
    decimalic(amount).isZero() ||
    amount === '' ||
    decimalic(penaltyAmount).isZero()
  ) {
    return t(translations.common.na);
  }

  const penaltyAmountPercentage = Math.ceil(
    (Number(penaltyAmount) / Number(amount)) * 100,
  );

  return (
    <AmountRenderer
      value={Number(penaltyAmount)}
      suffix={`${COMMON_SYMBOLS.SOV} (${penaltyAmountPercentage}%)`}
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
      suffix={COMMON_SYMBOLS.SOV}
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

export const renderVotingPower = (votingPower: number) =>
  votingPower !== 0 ? (
    <AmountRenderer
      value={votingPower}
      suffix={VP}
      precision={TOKEN_RENDER_PRECISION}
      dataAttribute="adjust-stake-voting-power"
      className="font-semibold"
    />
  ) : (
    t(translations.common.na)
  );

export const isAddress = (address: string) =>
  address.match(/^0x[a-fA-F0-9]{40}$/);

export const getAdjustStakeAction = (index: number) => {
  switch (index) {
    case 0:
      return AdjustStakeAction.Increase;
    case 1:
      return AdjustStakeAction.Decrease;
    case 2:
      return AdjustStakeAction.Extend;
    case 3:
      return AdjustStakeAction.Delegate;
    default:
      return AdjustStakeAction.Increase;
  }
};
