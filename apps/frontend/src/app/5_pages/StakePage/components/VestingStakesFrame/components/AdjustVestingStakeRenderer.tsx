import React, { FC, useMemo, useReducer } from 'react';

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
import { MS } from '../../../../../../constants/general';
import { translations } from '../../../../../../locales/i18n';
import { Vesting } from '../VestingStakesFrame.types';
import { useGetVestingStakeStartEndDates } from '../hooks/useGetVestingStakeStartEndDates';

export const AdjustVestingStakeRenderer: FC<Vesting> = ({
  vestingContract,
}) => {
  const [openVestingStakeDialog, toggleVestingStakeDialog] = useReducer(
    v => !v,
    false,
  );

  const { endDate } = useGetVestingStakeStartEndDates(vestingContract);

  const currentDate = useMemo(() => new Date(), []);

  const isDisabled = useMemo(
    () => currentDate.getTime() / MS > Number(endDate),
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
            vestingContract={vestingContract}
            onSuccess={toggleVestingStakeDialog}
          />
        </DialogBody>
      </Dialog>
    </div>
  );
};
