import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ErrorBadge,
  ErrorLevel,
  Input,
  Paragraph,
  ParagraphSize,
  SimpleTable,
  SimpleTableRow,
  TabType,
  Tabs,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { useGetWeight } from '../../../../5_pages/StakePage/components/StakesFrame/hooks/useGetWeight';
import { useGetVotingPower } from '../../../../5_pages/StakePage/hooks/useGetVotingPower';
import {
  TOKEN_RENDER_PRECISION,
  VP,
} from '../../../../../constants/currencies';
import { MS, WEIGHT_FACTOR } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../locales/i18n';
import { AdjustStakeFormProps } from '../../StakeForm.types';
import { useGetPenaltyAmount } from '../../hooks/useGetPenaltyAmount';
import { StakeDatePicker } from '../StakeDatePicker/StakeDatePicker';
import { adjustStakeTabs } from './AdjustStakeForm.constants';
import {
  renderPenaltyAmount,
  renderNewStakedAmount,
  renderVotingPowerChanged,
  renderNewVotingPower,
} from './AdjustStakeForm.utils';

export const AdjustStakeForm: FC<AdjustStakeFormProps> = ({ stake }) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState('');
  const [index, setIndex] = useState(0);
  const { balance } = useAssetBalance(SupportedTokens.sov);
  const [delegateToAddress, setDelegateToAddress] = useState('');
  const [votingPowerChanged, setVotingPowerChanged] = useState(0);
  const [unlockDate, setUnlockDate] = useState(0);

  const isIncreaseTab = useMemo(() => index === 0, [index]);
  const isDecreaseTab = useMemo(() => index === 1, [index]);
  const isExtendTab = useMemo(() => index === 2, [index]);
  const isDelegateTab = useMemo(() => index === 3, [index]);

  const { weight } = useGetWeight(!isExtendTab ? stake.unlockDate : unlockDate);
  const votingPower = useGetVotingPower(stake.stakedAmount, stake.unlockDate);

  const isPenaltyAmountValid = useMemo(
    () => Number(amount) > 0 && Number(amount) <= Number(stake.stakedAmount),
    [amount, stake.stakedAmount],
  );

  const penaltyAmount = useGetPenaltyAmount(
    !isPenaltyAmountValid ? '' : amount,
    stake.unlockDate,
  );

  const hasDelegatedAddress = useMemo(
    () => stake.delegate.length > 0,
    [stake.delegate],
  );

  const onMaximumAmountClick = useCallback(
    () => setAmount(isDecreaseTab ? stake.stakedAmount : balance.toString()),
    [balance, stake.stakedAmount, isDecreaseTab],
  );

  const isValidAmount = useMemo(
    () =>
      isDecreaseTab
        ? Number(amount) <= Number(stake.stakedAmount)
        : Number(amount) <= Number(balance),
    [amount, balance, stake.stakedAmount, isDecreaseTab],
  );

  const isSubmitDisabled = useMemo(
    () =>
      !isExtendTab
        ? !amount || Number(amount) <= 0 || Number(amount) > Number(balance)
        : unlockDate === 0,
    [amount, balance, isExtendTab, unlockDate],
  );

  const invalidAddress = useMemo(() => false, []);

  const getPenaltyAmount = useCallback(() => {
    return renderPenaltyAmount(amount, penaltyAmount, isValidAmount);
  }, [amount, penaltyAmount, isValidAmount]);

  const getNewStakedAmount = useCallback(
    () =>
      renderNewStakedAmount(
        amount,
        stake.stakedAmount,
        isValidAmount,
        isDecreaseTab,
      ),
    [amount, stake.stakedAmount, isValidAmount, isDecreaseTab],
  );

  const getVotingPowerChanged = useCallback(
    () =>
      renderVotingPowerChanged(
        isExtendTab ? stake.stakedAmount : amount,
        votingPowerChanged,
        isValidAmount,
        isExtendTab ? unlockDate : stake.unlockDate,
      ),
    [amount, votingPowerChanged, isValidAmount, isExtendTab, stake, unlockDate],
  );

  const getNewVotingPower = useCallback(
    () =>
      renderNewVotingPower(
        isExtendTab ? stake.stakedAmount : amount,
        isValidAmount,
        votingPower,
        votingPowerChanged,
        isDecreaseTab,
        isExtendTab ? unlockDate : stake.unlockDate,
      ),
    [
      amount,
      isValidAmount,
      votingPower,
      votingPowerChanged,
      isDecreaseTab,
      isExtendTab,
      stake,
      unlockDate,
    ],
  );

  useEffect(() => {
    if (!isValidAmount) {
      setVotingPowerChanged(0);
    }
    if (weight !== 0) {
      setVotingPowerChanged(
        (Number(!isExtendTab ? amount : stake.stakedAmount) * weight) /
          WEIGHT_FACTOR,
      );
    }
  }, [amount, weight, isValidAmount, isExtendTab, stake.stakedAmount]);

  useEffect(() => {
    setAmount('');
    setUnlockDate(0);
    setVotingPowerChanged(0);
  }, [index]);

  return (
    <>
      <Paragraph size={ParagraphSize.base} className="font-medium w-full mb-4">
        {t(translations.stakePage.stakeForm.stakeDetails)}
      </Paragraph>

      <div className="w-full flex justify-start gap-6 mb-10">
        <div>
          <Paragraph
            className="font-medium mb-1 text-gray-30"
            size={ParagraphSize.small}
          >
            {t(translations.stakePage.stakeForm.stakeDetails)}
          </Paragraph>
          <div className="text-sm font-semibold">
            <AmountRenderer
              value={stake.stakedAmount}
              suffix={SupportedTokens.sov}
              precision={TOKEN_RENDER_PRECISION}
              dataAttribute="adjust-stake-staked-sov-amount"
              className="font-semibold"
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
              value={votingPower}
              suffix={VP}
              precision={TOKEN_RENDER_PRECISION}
              dataAttribute="adjust-stake-voting-power"
              className="font-semibold"
            />
          </div>
        </div>

        <div>
          <Paragraph
            className="font-medium mb-1 text-gray-30"
            size={ParagraphSize.small}
          >
            {t(translations.stakePage.stakeForm.endDate)}
          </Paragraph>
          <div className="text-sm font-semibold">
            {dayjs(stake.unlockDate * MS).format('YYYY-MM-DD')}
          </div>
        </div>
      </div>

      <Tabs
        type={TabType.secondary}
        items={adjustStakeTabs}
        onChange={setIndex}
        index={index}
        className="mb-6"
      />

      {isExtendTab && (
        <>
          <div className="w-full flex flex-row justify-between items-center">
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(translations.stakePage.stakeForm.newEndDate)}
            </Paragraph>
          </div>
          <StakeDatePicker
            previouslySelectedDate={stake.unlockDate}
            onChange={setUnlockDate}
          />
        </>
      )}

      {(isIncreaseTab || isDecreaseTab) && (
        <div>
          <div className="w-full flex justify-end">
            <MaxButton
              onClick={onMaximumAmountClick}
              value={isDecreaseTab ? stake.stakedAmount : balance}
              token={SupportedTokens.sov}
              dataAttribute="adjust-stake-amount-max"
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
            dataAttribute="adjust-stake-amount"
            placeholder="0"
          />

          {!isValidAmount && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={t(translations.stakePage.stakeForm.invalidAmountError)}
              dataAttribute="adjust-stake-amount-error"
            />
          )}
        </div>
      )}

      {isDelegateTab && (
        <>
          {hasDelegatedAddress && (
            <>
              <Paragraph
                size={ParagraphSize.base}
                className="font-medium w-full mt-6"
              >
                {t(translations.stakePage.stakeForm.currentDelegateAddress)}
              </Paragraph>
              <Input
                readOnly
                value={stake.delegate.toLowerCase()}
                className="mt-3 w-full"
              />
            </>
          )}

          <Paragraph
            size={ParagraphSize.base}
            className="font-medium w-full mt-6"
          >
            {t(translations.stakePage.stakeForm.newDelegateAddress)}
          </Paragraph>
          <Input
            value={delegateToAddress}
            onChangeText={setDelegateToAddress}
            className="mt-3 w-full"
            invalid={invalidAddress}
          />
        </>
      )}

      {!isDelegateTab && (
        <SimpleTable dataAttribute="adjust-stake-table" className="mt-6">
          {isDecreaseTab && (
            <SimpleTableRow
              className="mb-3"
              label={t(translations.stakePage.stakeForm.penalty)}
              value={getPenaltyAmount()}
            />
          )}
          {!isExtendTab && (
            <SimpleTableRow
              className="mb-3"
              label={t(translations.stakePage.stakeForm.newStakeAmount)}
              value={getNewStakedAmount()}
            />
          )}
          <SimpleTableRow
            className="mb-3"
            label={
              isDecreaseTab
                ? t(translations.stakePage.stakeForm.votingPowerDecrease)
                : t(translations.stakePage.stakeForm.votingPowerIncrease)
            }
            value={getVotingPowerChanged()}
          />
          <SimpleTableRow
            label={t(translations.stakePage.stakeForm.newVotingPower)}
            value={getNewVotingPower()}
          />
        </SimpleTable>
      )}
      <Button
        text={t(translations.common.buttons.confirm)}
        // onClick={onContinueClick}
        disabled={isSubmitDisabled}
        className="mt-10 w-full"
        dataAttribute="adjust-stake-confirm"
      />
    </>
  );
};
