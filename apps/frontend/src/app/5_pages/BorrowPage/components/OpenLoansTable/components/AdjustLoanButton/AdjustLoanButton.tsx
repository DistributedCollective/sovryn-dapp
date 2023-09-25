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

import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { AdjustLoanForm } from '../../../AdjustLoanForm/AdjustLoanForm';
import { LoanItem } from '../../OpenLoansTable.types';

type AdjustLoanButtonProps = {
  loan: LoanItem;
};

export const AdjustLoanButton: FC<AdjustLoanButtonProps> = ({ loan }) => {
  const { account } = useAccount();
  const [openAdjustLoanDialog, toggleAdjustLoanDialog] = useReducer(
    v => !v,
    false,
  );

  const onSuccess = useCallback(
    () => toggleAdjustLoanDialog(),
    [toggleAdjustLoanDialog],
  );

  return (
    <>
      <Button
        text={t(translations.fixedInterestPage.openLoansTable.actions.adjust)}
        style={ButtonStyle.primary}
        onClick={toggleAdjustLoanDialog}
        disabled={!account}
        dataAttribute="adjust-loan-button"
      />

      <Dialog
        isOpen={openAdjustLoanDialog}
        dataAttribute="adjust-loan-dialog"
        width={DialogSize.md}
        disableFocusTrap
      >
        <DialogHeader
          title={t(translations.fixedInterestPage.adjustLoanDialog.title)}
          onClose={toggleAdjustLoanDialog}
        />
        <DialogBody
          children={<AdjustLoanForm loan={loan} onSuccess={onSuccess} />}
        />
      </Dialog>
    </>
  );
};
