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

import { useRequiredChain } from '../../../../../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { NewLoanForm } from '../../../NewLoanForm/NewLoanForm';

type NewLoanButtonProps = {
  pool: LendingPool;
};

export const NewLoanButton: FC<NewLoanButtonProps> = ({ pool }) => {
  const { account } = useAccount();
  const { invalidChain } = useRequiredChain();
  const [openNewLoanDialog, toggleNewLoanDialog] = useReducer(v => !v, false);

  const onSuccess = useCallback(
    () => toggleNewLoanDialog(),
    [toggleNewLoanDialog],
  );

  return (
    <>
      <Button
        text={t(translations.fixedInterestPage.borrowAssetsTable.action)}
        style={ButtonStyle.primary}
        onClick={toggleNewLoanDialog}
        disabled={!account || invalidChain}
        dataAttribute="new-loan-button"
        className="w-full lg:w-auto"
      />

      <Dialog
        isOpen={openNewLoanDialog}
        dataAttribute="new-loan-dialog"
        width={DialogSize.sm}
        disableFocusTrap
      >
        <DialogHeader
          title={t(translations.fixedInterestPage.newLoanDialog.title)}
          onClose={toggleNewLoanDialog}
        />
        <DialogBody
          children={<NewLoanForm pool={pool} onSuccess={onSuccess} />}
        />
      </Dialog>
    </>
  );
};
