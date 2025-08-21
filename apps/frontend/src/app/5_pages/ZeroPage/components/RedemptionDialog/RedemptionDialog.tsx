import React from 'react';

import { t } from 'i18next';

import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { RedemptionForm } from './RedemptionForm';
import { useRedemptionDialog } from './useRedemptionDialog';

export const RedemptionDialog = () => {
  const { isOpen, setOpen } = useRedemptionDialog();

  return (
    <Dialog width={DialogSize.sm} isOpen={isOpen} disableFocusTrap>
      <DialogHeader
        title={t(translations.zeroPage.redeem.title)}
        onClose={() => setOpen(false)}
      />
      <DialogBody>{isOpen && <RedemptionForm />}</DialogBody>
    </Dialog>
  );
};
