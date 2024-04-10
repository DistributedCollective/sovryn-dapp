import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

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
  HelperButton,
  Link,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import {
  STAKING_DELEGATION_LEARN_MORE_LINK,
  WEIGHT_FACTOR,
} from '../../../../5_pages/StakePage/StakePage.constants';
import { useGetWeight } from '../../../../5_pages/StakePage/components/StakesFrame/hooks/useGetWeight';
import { useGetVotingPower } from '../../../../5_pages/StakePage/hooks/useGetVotingPower';
import { useHandleAdjustStake } from '../../../../5_pages/StakePage/hooks/useHandleAdjustStake';
import {
  SOV,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { MS } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { areAddressesEqual } from '../../../../../utils/helpers';
import { AdjustStakeFormProps } from '../../StakeForm.types';
import { useGetPenaltyAmount } from '../../hooks/useGetPenaltyAmount';
import { StakeDatePicker } from '../StakeDatePicker/StakeDatePicker';
import {
  renderPenaltyAmount,
  renderNewStakedAmount,
  renderVotingPowerChanged,
  renderNewVotingPower,
  isAddress,
  renderVotingPower,
  getAdjustStakeAction,
} from './AdjustStakeForm.utils';

export const AdjustStakeForm: FC<AdjustStakeFormProps> = ({
  stake,
  onSuccess,
}) => {
  const { account } = useAccount();
  const [amount, setAmount] = useState('');

  const chainId = useCurrentChain();
  const { balance } = useAssetBalance(COMMON_SYMBOLS.SOV, chainId);
  const [delegateToAddress, setDelegateToAddress] = useState('');
  const [votingPowerChanged, setVotingPowerChanged] = useState(0);
  const [unlockDate, setUnlockDate] = useState(0);
  const currentDate = useMemo(() => Math.ceil(new Date().getTime() / MS), []);
  const isTabLocked = useMemo(
    () => stake.unlockDate < currentDate,
    [stake, currentDate],
  );
  const [index, setIndex] = useState(!isTabLocked ? 0 : 1);

  const isIncreaseTab = useMemo(() => index === 0, [index]);
  const isDecreaseTab = useMemo(() => index === 1, [index]);
  const isExtendTab = useMemo(() => index === 2, [index]);
  const isDelegateTab = useMemo(() => index === 3, [index]);

  const { checkMaintenance, States } = useMaintenance();
  const fullLocked = checkMaintenance(States.STAKING_FULL);
  const increaseLocked = checkMaintenance(States.STAKING_INCREASE);
  const decreaseLocked = checkMaintenance(States.STAKING_DECREASE);
  const extendLocked = checkMaintenance(States.STAKING_EXTEND);
  const delegateLocked = checkMaintenance(States.STAKING_DELEGATE);

  const { weight } = useGetWeight(!isExtendTab ? stake.unlockDate : unlockDate);
  const votingPower = useGetVotingPower(stake.stakedAmount, stake.unlockDate);

  const penaltyAmountValidated = useMemo(
    () =>
      isDecreaseTab && Number(amount) <= Number(stake.stakedAmount)
        ? amount
        : '0',
    [amount, stake.stakedAmount, isDecreaseTab],
  );

  const penaltyAmount = useGetPenaltyAmount(
    penaltyAmountValidated,
    stake.unlockDate > currentDate ? stake.unlockDate : 0,
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

  const isValidAddress = useMemo(() => {
    if (areAddressesEqual(delegateToAddress, stake.delegate || account)) {
      return false;
    }

    return isAddress(delegateToAddress) || delegateToAddress.length === 0;
  }, [delegateToAddress, stake.delegate, account]);

  const errorMessage = useMemo(() => {
    if (!isValidAddress) {
      if (!isAddress(delegateToAddress)) {
        return t(translations.stakePage.stakeForm.invalidAddressError);
      }
      if (areAddressesEqual(delegateToAddress, stake.delegate || account)) {
        return t(translations.stakePage.stakeForm.invalidDelegateError);
      }
    }
    return '';
  }, [isValidAddress, delegateToAddress, stake.delegate, account]);

  const isSubmitDisabled = useMemo(
    () =>
      fullLocked ||
      (isExtendTab && (unlockDate === 0 || extendLocked)) ||
      (isDecreaseTab &&
        (Number(amount) === 0 ||
          Number(amount) > Number(stake.stakedAmount) ||
          decreaseLocked)) ||
      (isIncreaseTab &&
        (Number(amount) === 0 ||
          Number(amount) > Number(balance) ||
          increaseLocked)) ||
      (isDelegateTab &&
        (!isValidAddress || delegateToAddress.length === 0 || delegateLocked)),

    [
      fullLocked,
      isExtendTab,
      unlockDate,
      extendLocked,
      isDecreaseTab,
      amount,
      stake.stakedAmount,
      decreaseLocked,
      isIncreaseTab,
      balance,
      increaseLocked,
      isDelegateTab,
      isValidAddress,
      delegateToAddress.length,
      delegateLocked,
    ],
  );

  const adjustStakeTabs = useMemo(
    () => [
      {
        label: t(translations.stakePage.stakeForm.increase),
        activeClassName: 'text-primary-20',
        dataAttribute: 'stake-increase',
        disabled: increaseLocked || isTabLocked,
      },
      {
        label: t(translations.stakePage.stakeForm.decrease),
        activeClassName: 'text-primary-20',
        dataAttribute: 'stake-decrease',
        disabled: decreaseLocked,
      },
      {
        label: t(translations.stakePage.stakeForm.extend),
        activeClassName: 'text-primary-20',
        dataAttribute: 'stake-extend',
        disabled: extendLocked,
      },
      {
        label: t(translations.stakePage.stakeForm.delegate),
        activeClassName: 'text-primary-20',
        dataAttribute: 'stake-delegate',
        disabled: delegateLocked || isTabLocked,
      },
    ],
    [decreaseLocked, delegateLocked, extendLocked, increaseLocked, isTabLocked],
  );

  useEffect(() => {
    if (adjustStakeTabs[index].disabled) {
      setIndex(adjustStakeTabs.findIndex(tab => !tab.disabled));
    }
  }, [adjustStakeTabs, index]);

  const getPenaltyAmount = useCallback(
    () => renderPenaltyAmount(amount, penaltyAmount, isValidAmount),
    [amount, penaltyAmount, isValidAmount],
  );

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
        isExtendTab ? unlockDate : isTabLocked ? 0 : stake.unlockDate,
      ),
    [
      amount,
      votingPowerChanged,
      isValidAmount,
      isExtendTab,
      stake,
      unlockDate,
      isTabLocked,
    ],
  );

  const getNewVotingPower = useCallback(
    () =>
      renderNewVotingPower(
        isExtendTab ? stake.stakedAmount : amount,
        isValidAmount,
        votingPower,
        votingPowerChanged,
        isDecreaseTab,
        isExtendTab ? unlockDate : isTabLocked ? 0 : stake.unlockDate,
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
      isTabLocked,
    ],
  );

  const onTransactionSuccess = useCallback(() => {
    setAmount('');
    setUnlockDate(0);
    setVotingPowerChanged(0);
    setDelegateToAddress('');
    onSuccess();
  }, [onSuccess]);

  const action = useMemo(() => getAdjustStakeAction(index), [index]);

  const handleAdjustStake = useHandleAdjustStake(
    amount,
    stake.unlockDate,
    onTransactionSuccess,
    unlockDate,
    delegateToAddress,
    action,
  );

  const handleSubmit = useCallback(() => {
    if (!isSubmitDisabled) {
      handleAdjustStake();
    }
  }, [isSubmitDisabled, handleAdjustStake]);

  useEffect(() => {
    if (!isValidAmount) {
      setVotingPowerChanged(0);
    }
    if (weight !== 0) {
      if (isExtendTab) {
        setVotingPowerChanged(
          (Number(stake.stakedAmount) * weight) / WEIGHT_FACTOR - votingPower,
        );
      } else {
        setVotingPowerChanged((Number(amount) * weight) / WEIGHT_FACTOR);
      }
    }
  }, [
    amount,
    weight,
    isValidAmount,
    isExtendTab,
    stake.stakedAmount,
    votingPower,
  ]);

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
              suffix={COMMON_SYMBOLS.SOV}
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
            {renderVotingPower(votingPower)}
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
              token={COMMON_SYMBOLS.SOV}
              dataAttribute="adjust-stake-amount-max"
            />
          </div>

          <AmountInput
            value={amount}
            onChangeText={setAmount}
            label={t(translations.common.amount)}
            min={0}
            unit={SOV}
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
              <Paragraph size={ParagraphSize.base} className="font-medium mt-6">
                {t(translations.stakePage.stakeForm.currentDelegateAddress)}
              </Paragraph>
              <Input
                readOnly
                value={stake.delegate.toLowerCase()}
                className="mt-3 max-w-full"
              />
            </>
          )}

          <div className="flex items-center gap-1 mt-6">
            <Paragraph size={ParagraphSize.base} className="font-medium">
              {t(translations.stakePage.stakeForm.newDelegateAddress)}{' '}
            </Paragraph>
            <HelperButton
              content={
                <Trans
                  i18nKey={t(translations.stakePage.stakeForm.delegateInfo)}
                  components={[
                    <Link
                      text={t(translations.stakePage.stakeForm.delegateInfoCta)}
                      href={STAKING_DELEGATION_LEARN_MORE_LINK}
                      openNewTab
                    />,
                  ]}
                />
              }
            />
          </div>
          <Input
            value={delegateToAddress}
            onChangeText={setDelegateToAddress}
            className="mt-3 max-w-full"
            invalid={!isValidAddress}
            dataAttribute="adjust-stake-delegate-address"
          />
          {!isValidAddress && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={errorMessage}
              dataAttribute="adjust-stake-delegate-address-error"
            />
          )}
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
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="mt-6 w-full"
        dataAttribute="adjust-stake-confirm"
      />
      {fullLocked && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.featureDisabled)}
        />
      )}
    </>
  );
};
