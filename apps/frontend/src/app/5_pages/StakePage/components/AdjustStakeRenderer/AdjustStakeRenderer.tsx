import React, { FC, useCallback, useReducer } from 'react';

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

import { AdjustStakeForm } from '../../../../3_organisms/StakeForm/components/AdjustStakeForm/AdjustStakeForm';
import { translations } from '../../../../../locales/i18n';
import { StakeItem } from '../StakesFrame/StakesFrame.types';

type AdjustStakeRendererProps = {
  stake: StakeItem;
  onSuccess: () => void;
};

export const AdjustStakeRenderer: FC<AdjustStakeRendererProps> = ({
  stake,
  onSuccess,
}) => {
  const [openCreateStakeDialog, toggleAdjustStakeDialog] = useReducer(
    v => !v,
    false,
  );

  const onAdjustSuccess = useCallback(() => {
    onSuccess();
    toggleAdjustStakeDialog();
  }, [onSuccess]);

  return (
    <div className="flex lg:justify-end">
      <Button
        style={ButtonStyle.secondary}
        size={ButtonSize.small}
        text={t(translations.stakePage.table.adjustButton)}
        onClick={toggleAdjustStakeDialog}
        dataAttribute="stakes-adjust-button"
        className="lg:w-auto w-full"
      />
      <Dialog
        width={DialogSize.sm}
        isOpen={openCreateStakeDialog}
        disableFocusTrap
      >
        <DialogHeader
          title={t(translations.stakePage.stakeForm.adjustStake)}
          onClose={toggleAdjustStakeDialog}
        />
        <DialogBody>
          <AdjustStakeForm stake={stake} onSuccess={onAdjustSuccess} />
        </DialogBody>
      </Dialog>
    </div>
  );
};
