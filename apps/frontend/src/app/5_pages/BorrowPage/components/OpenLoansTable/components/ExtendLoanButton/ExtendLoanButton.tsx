import React, { FC, useCallback, useReducer } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
} from '@sovryn/ui';

import { ExtendLoanForm } from '../../../../../../3_organisms/BorrowLoan/components/ExtendLoanForm/ExtendLoanForm';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { LoanItem } from '../../OpenLoansTable.types';

type ExtendLoanButtonProps = {
  loan: LoanItem;
};

export const ExtendLoanButton: FC<ExtendLoanButtonProps> = ({ loan }) => {
  const { account } = useAccount();
  const [openExtendLoanDialog, toggleExtendLoanDialog] = useReducer(
    v => !v,
    false,
  );

  const onSuccess = useCallback(
    () => toggleExtendLoanDialog(),
    [toggleExtendLoanDialog],
  );
  return (
    <>
      <Button
        text={t(translations.fixedInterestPage.openLoansTable.actions.extend)}
        style={ButtonStyle.secondary}
        onClick={toggleExtendLoanDialog}
        disabled={!account}
      />

      <Dialog
        isOpen={openExtendLoanDialog}
        dataAttribute="extend-loan-dialog"
        width={DialogSize.md}
        disableFocusTrap
      >
        <DialogHeader
          title={t(translations.fixedInterestPage.extendLoanDialog.title)}
          onClose={toggleExtendLoanDialog}
        />
        <DialogBody
          children={<ExtendLoanForm loan={loan} onSuccess={onSuccess} />}
        />
      </Dialog>
    </>
  );
};
