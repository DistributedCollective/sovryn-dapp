import React, { FC, useReducer } from 'react';

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
import { Vesting } from '../VestingStakesFrame.types';

export const AdjustVestingStakeRenderer: FC<Vesting> = ({
  vestingContract,
}) => {
  const [openVestingStakeDialog, toggleVestingStakeDialog] = useReducer(
    v => !v,
    false,
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
