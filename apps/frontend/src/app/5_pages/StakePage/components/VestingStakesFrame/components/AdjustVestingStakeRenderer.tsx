import React, { FC, useMemo, useReducer } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
} from '@sovryn/ui';

import { AdjustVestingStakeForm } from '../../../../../3_organisms/StakeForm/components/AdjustVestingStakeForm/AdjustVestingStakeForm';
import { translations } from '../../../../../../locales/i18n';
import { VestingContractTableRecord } from '../VestingStakesFrame.types';

export const AdjustVestingStakeRenderer: FC<VestingContractTableRecord> = ({
  address,
  createdAtTimestamp,
  duration,
  delegatedAddress,
}) => {
  const [openVestingStakeDialog, toggleVestingStakeDialog] = useReducer(
    v => !v,
    false,
  );

  const endDate = useMemo(() => {
    if (typeof duration === 'number') {
      return createdAtTimestamp + duration;
    }
    return null;
  }, [duration, createdAtTimestamp]);

  const currentDate = useMemo(() => dayjs().unix(), []);
  const isDisabled = useMemo(
    () => currentDate > endDate!,
    [endDate, currentDate],
  );

  return (
    <div className="flex justify-end">
      <Button
        style={ButtonStyle.secondary}
        size={ButtonSize.small}
        text={t(translations.stakePage.table.adjustButton)}
        onClick={toggleVestingStakeDialog}
        dataAttribute="stakes-adjust-button"
        className="md:w-auto w-full"
        disabled={isDisabled}
      />
      <Dialog
        width={DialogSize.sm}
        isOpen={openVestingStakeDialog}
        disableFocusTrap
      >
        <DialogHeader
          title={t(translations.stakePage.stakeForm.adjustVestingStake)}
          onClose={toggleVestingStakeDialog}
        />
        <DialogBody>
          <AdjustVestingStakeForm
            vestingContract={address}
            onSuccess={toggleVestingStakeDialog}
            delegatedAddress={delegatedAddress || ''}
          />
        </DialogBody>
      </Dialog>
    </div>
  );
};
