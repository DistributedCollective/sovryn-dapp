import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { PreviewProposal } from '../PreviewProposal/PreviewProposal';

const pageTranslations = translations.bitocracyPage;

type PreviewProposalDialogProps = {
  onClose: () => void;
  disabled?: boolean;
};

export const PreviewProposalDialog: FC<PreviewProposalDialogProps> = ({
  onClose,
  disabled,
}) => (
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
    <DialogBody>
      <PreviewProposal disabled={disabled} onClose={onClose} />
    </DialogBody>
  </Dialog>
);
