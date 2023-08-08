import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  HelperButton,
  Input,
  Link,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { STAKING_DELEGATION_LEARN_MORE_LINK } from '../../../../5_pages/StakePage/StakePage.constants';
import { useGetVestingDelegateAddress } from '../../../../5_pages/StakePage/components/VestingStakesFrame/hooks/useGetVestingDelegateAddress';
import { useGetVestingStakeStartEndDates } from '../../../../5_pages/StakePage/components/VestingStakesFrame/hooks/useGetVestingStakeStartEndDates';
import { useHandleAdjustVestingStake } from '../../../../5_pages/StakePage/hooks/useHandleAdjustVestingStake';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { areAddressesEqual } from '../../../../../utils/helpers';
import { isAddress } from '../AdjustStakeForm/AdjustStakeForm.utils';

type AdjustVestingStakeFormProps = {
  vestingContract: string;
  onSuccess: () => void;
};

export const AdjustVestingStakeForm: FC<AdjustVestingStakeFormProps> = ({
  vestingContract,
  onSuccess,
}) => {
  const { account } = useAccount();
  const { endDate } = useGetVestingStakeStartEndDates(vestingContract);
  const delegatedAddress = useGetVestingDelegateAddress(
    vestingContract,
    Number(endDate),
  );
  const [delegateToAddress, setDelegateToAddress] = useState('');

  const isValidAddress = useMemo(() => {
    if (areAddressesEqual(delegateToAddress, account)) {
      return false;
    }

    return isAddress(delegateToAddress) || delegateToAddress.length === 0;
  }, [delegateToAddress, account]);

  const errorMessage = useMemo(() => {
    if (!isValidAddress) {
      if (!isAddress(delegateToAddress)) {
        return t(translations.stakePage.stakeForm.invalidAddressError);
      }
      if (areAddressesEqual(delegateToAddress, account)) {
        return t(translations.stakePage.stakeForm.invalidDelegateError);
      }
    }
    return '';
  }, [isValidAddress, delegateToAddress, account]);

  const isSubmitDisabled = useMemo(
    () => !isValidAddress || delegateToAddress.length === 0,
    [isValidAddress, delegateToAddress],
  );

  const onTransactionSuccess = useCallback(() => {
    setDelegateToAddress('');
    onSuccess();
  }, [onSuccess]);

  const handleAdjustStake = useHandleAdjustVestingStake(
    delegateToAddress,
    onTransactionSuccess,
  );

  const handleSubmit = useCallback(() => {
    if (!isSubmitDisabled) {
      handleAdjustStake();
    }
  }, [isSubmitDisabled, handleAdjustStake]);

  return (
    <>
      <div className="w-full gap-6">
        <Paragraph size={ParagraphSize.base} className="font-medium">
          {t(translations.stakePage.stakeForm.currentDelegateAddress)}
        </Paragraph>
        <Input
          readOnly
          value={delegatedAddress.toLowerCase()}
          className="mt-3 max-w-full"
        />

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
          dataAttribute="adjust-vesting-stake-delegate-address"
        />

        {!isValidAddress && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={errorMessage}
            dataAttribute="adjust-vesting-stake-delegate-address-error"
          />
        )}
      </div>

      <Button
        text={t(translations.common.buttons.confirm)}
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        className="mt-10 w-full"
        dataAttribute="adjust-vesting-stake-confirm"
      />
    </>
  );
};
