import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import { ProposalCreationStep } from '../../../../contexts/ProposalContext.types';
import { PreviewProposal } from '../PreviewProposal/PreviewProposal';

const pageTranslations = translations.bitocracyPage;

export const PreviewProposalDialog: FC = () => {
  const { setStep } = useProposalContext();
  const onClose = useCallback(() => {
    setStep(ProposalCreationStep.Details);
  }, [setStep]);

  return (
    <Dialog
      isOpen={true}
      dataAttribute="preview-proposal-dialog"
      width={DialogSize.xl3}
      disableFocusTrap
    >
      <DialogHeader
        title={t(pageTranslations.proposalPreview.title)}
        onClose={onClose}
      />
      <DialogBody children={<PreviewProposal />} />
    </Dialog>
  );
};
