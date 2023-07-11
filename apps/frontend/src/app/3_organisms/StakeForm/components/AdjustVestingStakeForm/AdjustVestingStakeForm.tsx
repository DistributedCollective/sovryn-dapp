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

import { useGetVestingDelegateAddress } from '../../../../5_pages/StakePage/components/VestingStakesFrame/hooks/useGetVestingDelegateAddress';
import { useGetVestingStakeStartEndDates } from '../../../../5_pages/StakePage/components/VestingStakesFrame/hooks/useGetVestingStakeStartEndDates';
import { useHandleAdjustVestingStake } from '../../../../5_pages/StakePage/hooks/useHandleAdjustVestingStake';
import { DELEGATION_LEARN_MORE_LINK } from '../../../../../constants/links';
import { translations } from '../../../../../locales/i18n';
import { isAddress } from '../AdjustStakeForm/AdjustStakeForm.utils';

type AdjustVestingStakeFormProps = {
  vestingContract: string;
};

export const AdjustVestingStakeForm: FC<AdjustVestingStakeFormProps> = ({
  vestingContract,
}) => {
  const { endDate } = useGetVestingStakeStartEndDates(vestingContract);
  const delegatedAddress = useGetVestingDelegateAddress(
    vestingContract,
    Number(endDate),
  );
  const [delegateToAddress, setDelegateToAddress] = useState('');

  const isValidAddress = useMemo(
    () => isAddress(delegateToAddress) || delegateToAddress.length === 0,
    [delegateToAddress],
  );

  const isSubmitDisabled = useMemo(
    () => !isValidAddress || delegateToAddress.length === 0,
    [isValidAddress, delegateToAddress],
  );

  const onTransactionSuccess = useCallback(() => {
    setDelegateToAddress('');
  }, []);

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

        <Paragraph size={ParagraphSize.base} className="font-medium mt-6">
          <div className="flex items-center gap-1">
            {t(translations.stakePage.stakeForm.newDelegateAddress)}{' '}
            <HelperButton
              tooltipClassName="max-w-56 md:max-72"
              content={
                <Trans
                  i18nKey={t(translations.stakePage.stakeForm.delegateInfo)}
                  components={[
                    <Link
                      text={t(translations.stakePage.stakeForm.delegateInfoCta)}
                      href={DELEGATION_LEARN_MORE_LINK}
                      openNewTab
                    />,
                  ]}
                />
              }
            />
          </div>
        </Paragraph>
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
            message={t(translations.stakePage.stakeForm.invalidAddressError)}
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
