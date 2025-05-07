import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ErrorBadge,
  ErrorLevel,
  Paragraph,
  ParagraphSize,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import {
  VP,
  WEIGHT_FACTOR,
} from '../../../../5_pages/StakePage/StakePage.constants';
import { useGetPersonalStakingStatistics } from '../../../../5_pages/StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { useGetWeight } from '../../../../5_pages/StakePage/components/StakesFrame/hooks/useGetWeight';
import { useGetStakingBalanceOf } from '../../../../5_pages/StakePage/hooks/useGetStakingBalanceOf';
import { useGetTotalVestingsBalance } from '../../../../5_pages/StakePage/hooks/useGetTotalVestingsBalance';
import { useHandleStake } from '../../../../5_pages/StakePage/hooks/useHandleStake';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { useAccount } from '../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { decimalic, fromWei } from '../../../../../utils/math';
import { StakeFormProps } from '../../StakeForm.types';
import { StakeDatePicker } from '../StakeDatePicker/StakeDatePicker';

export const AddStakeForm: FC<StakeFormProps> = ({
  hasStakedValue,
  onSuccess,
}) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState('');
  const [unlockDate, setUnlockDate] = useState(0);

  const chainId = useCurrentChain();
  const { balance } = useAssetBalance(COMMON_SYMBOLS.SOV, chainId);
  const { balance: stakedValue } = useGetStakingBalanceOf(account);
  const totalVestingsBalance = useGetTotalVestingsBalance();

  const totalStakedValue = useMemo(
    () => Decimal.fromBigNumberString(stakedValue).add(totalVestingsBalance),
    [stakedValue, totalVestingsBalance],
  );

  const { votingPower } = useGetPersonalStakingStatistics();
  const [votingPowerReceived, setVotingPowerReceived] = useState(0);

  const { weight } = useGetWeight(unlockDate);

  const { checkMaintenance, States } = useMaintenance();
  const stakingLocked = useMemo(
    () =>
      checkMaintenance(States.STAKING_FULL) ||
      checkMaintenance(States.STAKING_NEW),
    [States.STAKING_FULL, States.STAKING_NEW, checkMaintenance],
  );

  const onMaximumAmountClick = useCallback(
    () => setAmount(balance.toString()),
    [balance, setAmount],
  );

  const isValidAmount = useMemo(
    () => Number(amount) <= Number(balance),
    [amount, balance],
  );

  const isSubmitDisabled = useMemo(
    () =>
      stakingLocked ||
      !amount ||
      Number(amount) <= 0 ||
      Number(amount) > Number(balance) ||
      unlockDate === 0,
    [amount, balance, stakingLocked, unlockDate],
  );

  const isRenderValid = useMemo(
    () =>
      decimalic(amount).gt(0) && isValidAmount && unlockDate > 0 && weight > 0,
    [amount, isValidAmount, unlockDate, weight],
  );

  const renderNewStakedAmount = useCallback(
    () =>
      !isRenderValid ? (
        t(translations.common.na)
      ) : (
        <AmountRenderer
          value={totalStakedValue.add(amount)}
          suffix={COMMON_SYMBOLS.SOV}
          precision={TOKEN_RENDER_PRECISION}
        />
      ),
    [amount, totalStakedValue, isRenderValid],
  );

  const renderVotingPowerReceived = useCallback(
    () =>
      !isRenderValid ? (
        t(translations.common.na)
      ) : (
        <AmountRenderer
          value={votingPowerReceived}
          suffix={VP}
          precision={TOKEN_RENDER_PRECISION}
        />
      ),
    [votingPowerReceived, isRenderValid],
  );

  const renderNewVotingPowerIncrease = useCallback(
    () =>
      !isRenderValid ? (
        t(translations.common.na)
      ) : (
        <AmountRenderer
          value={decimalic(fromWei(votingPower)).add(votingPowerReceived)}
          suffix={VP}
          precision={TOKEN_RENDER_PRECISION}
        />
      ),
    [votingPower, votingPowerReceived, isRenderValid],
  );

  const onTransactionSuccess = useCallback(() => {
    setAmount('');
    setUnlockDate(0);
    onSuccess();
  }, [onSuccess]);

  const handleSubmitStake = useHandleStake(
    amount,
    unlockDate,
    onTransactionSuccess,
  );

  const handleSubmit = useCallback(() => {
    if (!isSubmitDisabled) {
      handleSubmitStake();
    }
  }, [isSubmitDisabled, handleSubmitStake]);

  useEffect(() => {
    if (!isRenderValid) {
      setVotingPowerReceived(0);
      return;
    }

    const newVotingPower = (Number(amount) * weight) / WEIGHT_FACTOR;

    if (!isNaN(newVotingPower) && weight > 0) {
      setVotingPowerReceived(newVotingPower);
    }
  }, [amount, weight, isRenderValid]);

  return (
    <div>
      {hasStakedValue && (
        <div className="w-full flex justify-start gap-16 mb-6">
          <div>
            <Paragraph
              className="font-medium mb-1 text-gray-30"
              size={ParagraphSize.small}
            >
              {t(translations.stakePage.stakeForm.stakedSov)}
            </Paragraph>
            <div className="text-sm font-semibold">
              <AmountRenderer
                value={totalStakedValue}
                suffix={COMMON_SYMBOLS.SOV}
                precision={TOKEN_RENDER_PRECISION}
                dataAttribute="create-stake-staked-sov-amount"
              />
            </div>
          </div>

          <div>
            <Paragraph
              className="font-medium mb-1 text-gray-30"
              size={ParagraphSize.small}
            >
              {t(translations.stakePage.stakeForm.votingPower)}
            </Paragraph>
            <div className="text-sm font-semibold">
              <AmountRenderer
                value={fromWei(votingPower)}
                suffix={VP}
                precision={TOKEN_RENDER_PRECISION}
                dataAttribute="create-stake-voting-power-amount"
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end">
        <MaxButton
          onClick={onMaximumAmountClick}
          value={balance}
          token={COMMON_SYMBOLS.SOV}
          dataAttribute="create-stake-amount-max"
        />
      </div>

      <AmountInput
        value={amount}
        onChangeText={setAmount}
        label={t(translations.common.amount)}
        min={0}
        invalid={!isValidAmount}
        disabled={!account}
        className="w-full mt-4 max-w-full"
        dataAttribute="create-stake-amount"
        placeholder="0"
      />

      {!isValidAmount && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.stakePage.stakeForm.invalidAmountError)}
          dataAttribute="create-stake-amount-error"
        />
      )}

      <div className="w-full flex flex-row justify-between items-center mt-6">
        <Paragraph size={ParagraphSize.base} className="font-medium">
          {t(translations.stakePage.stakeForm.endDate)}
        </Paragraph>
      </div>

      <StakeDatePicker onChange={setUnlockDate} />

      <SimpleTable dataAttribute="create-stake-table">
        {hasStakedValue && (
          <SimpleTableRow
            className="mb-3"
            label={t(translations.stakePage.stakeForm.newStakedSov)}
            value={renderNewStakedAmount()}
          />
        )}
        <SimpleTableRow
          label={t(translations.stakePage.stakeForm.votingPowerIncrease)}
          value={renderVotingPowerReceived()}
        />
        {hasStakedValue && (
          <SimpleTableRow
            label={t(translations.stakePage.stakeForm.newVotingPower)}
            value={renderNewVotingPowerIncrease()}
          />
        )}
      </SimpleTable>
      <Button
        text={t(translations.common.buttons.confirm)}
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="mt-6 w-full"
        dataAttribute="create-stake-confirm"
      />
      {stakingLocked && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.featureDisabled)}
        />
      )}
    </div>
  );
};
