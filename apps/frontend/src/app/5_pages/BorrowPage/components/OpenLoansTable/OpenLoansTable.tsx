import React, { FC, useMemo, useState, useCallback } from 'react';

import { t } from 'i18next';

import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  Paragraph,
  Table,
} from '@sovryn/ui';

import { AdjustLoanForm } from '../../../../3_organisms/BorrowLoan/components/AdjustLoanForm/AdjustLoanForm';
import { ExtendLoanForm } from '../../../../3_organisms/BorrowLoan/components/ExtendLoanForm/ExtendLoanForm';
import { translations } from '../../../../../locales/i18n';
import { generateRowTitle } from './OpenLoans.utils';
import { COLUMNS_CONFIG } from './OpenLoansTable.constants';
import { LoanItem } from './OpenLoansTable.types';

type OpenLoansTableProps = {
  loans: LoanItem[];
  loading: boolean;
};

export const OpenLoansTable: FC<OpenLoansTableProps> = ({ loans, loading }) => {
  const [adjustLoanId, setAdjustLoanId] = useState<string>();
  const [extendLoanId, setExtendLoanId] = useState<string>();

  const onAdjustClose = useCallback(
    () => setAdjustLoanId(undefined),
    [setAdjustLoanId],
  );

  const onExtendClose = useCallback(
    () => setExtendLoanId(undefined),
    [setExtendLoanId],
  );

  const loanToAdjust = useMemo(
    () => loans.find(loan => loan.id === adjustLoanId),
    [adjustLoanId, loans],
  );

  const loanToExtend = useMemo(
    () => loans.find(loan => loan.id === extendLoanId),
    [extendLoanId, loans],
  );

  return (
    <div className="flex flex-col mb-10 border border-solid rounded border-gray-50 px-6 py-12">
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <Paragraph className="text-base font-medium">
          {t(translations.fixedInterestPage.openLoansTable.title)}
        </Paragraph>
      </div>

      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          columns={COLUMNS_CONFIG(setAdjustLoanId, setExtendLoanId)}
          rows={loans}
          rowTitle={generateRowTitle}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          isLoading={loading}
          dataAttribute="borrow-assets-table"
        />
      </div>

      <Dialog
        isOpen={!!loanToAdjust}
        dataAttribute="extend-loan-dialog"
        width={DialogSize.md}
        disableFocusTrap
      >
        <DialogHeader
          title={t(translations.fixedInterestPage.extendLoanDialog.title)}
          onClose={onAdjustClose}
        />
        <DialogBody children={<AdjustLoanForm loan={loanToAdjust!} />} />
      </Dialog>

      <Dialog
        isOpen={!!loanToExtend}
        dataAttribute="extend-loan-dialog"
        width={DialogSize.md}
        disableFocusTrap
      >
        <DialogHeader
          title={t(translations.fixedInterestPage.extendLoanDialog.title)}
          onClose={onExtendClose}
        />
        <DialogBody children={<ExtendLoanForm loan={loanToExtend!} />} />
      </Dialog>
    </div>
  );
};
