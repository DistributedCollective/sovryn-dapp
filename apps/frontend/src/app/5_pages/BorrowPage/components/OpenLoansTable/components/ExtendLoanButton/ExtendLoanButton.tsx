import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { useRequiredChain } from '../../../../../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { LoanItem } from '../../OpenLoansTable.types';

type ExtendLoanButtonProps = {
  loan: LoanItem;
  onClick: (id: string) => void;
};

export const ExtendLoanButton: FC<ExtendLoanButtonProps> = ({
  loan,
  onClick,
}) => {
  const { account } = useAccount();
  const { invalidChain } = useRequiredChain();

  const onExtend = useCallback(() => onClick(loan.id), [loan, onClick]);

  return (
    <Button
      text={t(translations.fixedInterestPage.openLoansTable.actions.extend)}
      style={ButtonStyle.secondary}
      onClick={onExtend}
      disabled={!account || invalidChain}
      dataAttribute="extend-loan-button"
    />
  );
};
