import React, { FC, useMemo, useReducer } from 'react';

import { t } from 'i18next';

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  Tooltip,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useGetVotingPowerShare } from '../../../../../hooks/useGetVotingPowerShare';
import { translations } from '../../../../../locales/i18n';
import { NewProposalForm } from '../NewProposalForm/NewProposalForm';

const pageTranslations = translations.bitocracyPage;

type NewProposalButtonProps = {
  hasActiveProposal: boolean;
};

export const NewProposalButton: FC<NewProposalButtonProps> = ({
  hasActiveProposal,
}) => {
  const votingPowerShare = useGetVotingPowerShare();

  const [openNewProposalDialog, toggleNewProposalDialog] = useReducer(
    v => !v,
    false,
  );

  const isNewProposalButtonVisible = useMemo(
    () => (votingPowerShare ? votingPowerShare.gt(Decimal.ONE) : false),
    [votingPowerShare],
  );

  return (
    <>
      {isNewProposalButtonVisible && (
        <Tooltip
          content={t(pageTranslations.activeProposalError)}
          disabled={!hasActiveProposal}
          className="sm:ml-3 sm:relative fixed bottom-0 left-0 right-0"
        >
          <div className="bg-gray-90 sm:bg-transparent p-4 pb-8 sm:p-0 border-t sm:border-none border-gray-60 flex items-center justify-center  z-10 sm:z-0">
            <Button
              text={t(pageTranslations.actions.createProposal)}
              className="w-full sm:w-auto"
              onClick={toggleNewProposalDialog}
              disabled={hasActiveProposal}
            />
          </div>
        </Tooltip>
      )}

      <Dialog
        isOpen={openNewProposalDialog}
        dataAttribute="new-proposal-dialog"
        width={DialogSize.lg}
        disableFocusTrap
      >
        <DialogHeader
          title={t(pageTranslations.actions.createProposal)}
          onClose={toggleNewProposalDialog}
        />
        <DialogBody children={<NewProposalForm />} />
      </Dialog>
    </>
  );
};
