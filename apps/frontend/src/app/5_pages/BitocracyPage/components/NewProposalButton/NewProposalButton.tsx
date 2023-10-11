import React, { FC, useMemo, useReducer } from 'react';

import { t } from 'i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
} from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { useGetPersonalStakingStatistics } from '../../../StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { NewProposalForm } from '../NewProposalForm/NewProposalForm';

const pageTranslations = translations.bitocracyPage;

export const NewProposalButton: FC = () => {
  const { votingPower } = useGetPersonalStakingStatistics();

  const [openNewProposalDialog, toggleNewProposalDialog] = useReducer(
    v => !v,
    false,
  );

  const isNewProposalButtonVisible = useMemo(
    () => (votingPower ? Number(votingPower) > 0 : false),
    [votingPower],
  );

  return (
    <>
      {isNewProposalButtonVisible && (
        <div className="bg-gray-90 sm:bg-transparent p-4 pb-8 sm:p-0 border-t sm:border-none border-gray-60 flex items-center justify-center sm:ml-3 sm:relative fixed bottom-0 left-0 right-0 z-10 sm:z-0">
          <Button
            text={t(pageTranslations.actions.newProposal)}
            className="w-full sm:w-auto"
            onClick={toggleNewProposalDialog}
          />
        </div>
      )}

      <Dialog
        isOpen={openNewProposalDialog}
        dataAttribute="new-proposal-dialog"
        width={DialogSize.sm}
        disableFocusTrap
      >
        <DialogHeader
          title={t(pageTranslations.actions.newProposal)}
          onClose={toggleNewProposalDialog}
        />
        <DialogBody children={<NewProposalForm />} />
      </Dialog>
    </>
  );
};
