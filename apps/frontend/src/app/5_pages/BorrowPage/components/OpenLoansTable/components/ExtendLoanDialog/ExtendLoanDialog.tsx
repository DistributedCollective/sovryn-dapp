import React, { FC } from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';

type ExtendLoanDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ExtendLoanDialog: FC<ExtendLoanDialogProps> = ({
  isOpen,
  onClose,
}) => (
  <Dialog isOpen={isOpen}>
    <DialogHeader
      title={t(translations.fixedInterestPage.extendLoanDialog.title)}
      onClose={onClose}
    ></DialogHeader>
    <DialogBody>Extend a loan</DialogBody>
  </Dialog>
);
