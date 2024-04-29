import React, { FC, useCallback, useReducer, useState } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
} from '@sovryn/ui';

import { AddStakeForm } from '../../../../3_organisms/StakeForm/components/AddStakeForm/AddStakeForm';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { isRskChain } from '../../../../../utils/chain';
import { NextStepDialog } from '../NextStepDialog/NextStepDialog';

type AddStakeRendererProps = {
  hasStakedValue: boolean;
};

export const AddStakeRenderer: FC<AddStakeRendererProps> = ({
  hasStakedValue,
}) => {
  const navigate = useNavigate();
  const chainId = useCurrentChain();
  const [isNextStepOpen, setIsNextStepOpen] = useState(false);
  const [openCreateStakeDialog, toggleCreateStakeDialog] = useReducer(
    v => !v,
    false,
  );

  const onSuccess = useCallback(() => {
    toggleCreateStakeDialog();
    if (isRskChain(chainId)) {
      setIsNextStepOpen(true);
    }
  }, [chainId]);

  const onConfirm = useCallback(() => setIsNextStepOpen(false), []);

  return (
    <div className="flex md:flex-row items-center gap-4 flex-col-reverse">
      <NextStepDialog isOpen={isNextStepOpen} onConfirm={onConfirm} />
      {hasStakedValue && (
        <Button
          style={ButtonStyle.ghost}
          size={ButtonSize.small}
          text={t(translations.stakePage.table.rewardsButton)}
          onClick={() => navigate('/rewards')}
          dataAttribute="stakes-rewards-button"
          className="w-full md:w-auto"
        />
      )}
      <Button
        style={ButtonStyle.primary}
        size={ButtonSize.small}
        text={
          hasStakedValue
            ? t(translations.stakePage.table.addNewStakeButton)
            : t(translations.stakePage.table.stakeButton)
        }
        onClick={toggleCreateStakeDialog}
        dataAttribute="stakes-stake-button"
        className="w-full md:w-auto"
      />

      <Dialog
        width={DialogSize.sm}
        isOpen={openCreateStakeDialog}
        disableFocusTrap
      >
        <DialogHeader
          title={
            hasStakedValue
              ? t(translations.stakePage.stakeForm.createNewStake)
              : t(translations.stakePage.stakeForm.stakeSov)
          }
          onClose={toggleCreateStakeDialog}
        />
        <DialogBody>
          <AddStakeForm hasStakedValue={hasStakedValue} onSuccess={onSuccess} />
        </DialogBody>
      </Dialog>
    </div>
  );
};
