import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

type AdjustLoanDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AdjustLoanDialog: FC<AdjustLoanDialogProps> = ({
  isOpen,
  onClose,
}) => (
  <Dialog isOpen={isOpen}>
    <DialogHeader
      title={t(translations.fixedInterestPage.adjustLoanDialog.title)}
      onClose={onClose}
    ></DialogHeader>
    <DialogBody>Adjust a loan</DialogBody>
  </Dialog>
);
