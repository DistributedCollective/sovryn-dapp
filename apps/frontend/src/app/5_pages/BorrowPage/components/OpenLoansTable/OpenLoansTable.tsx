import React, { FC } from 'react';

import { t } from 'i18next';

import { Paragraph, Table } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { generateRowTitle } from './OpenLoans.utils';
import { COLUMNS_CONFIG } from './OpenLoansTable.constants';
import { LoanItem } from './OpenLoansTable.types';

type OpenLoansTableProps = {
  loans: LoanItem[];
  loading: boolean;
};

export const OpenLoansTable: FC<OpenLoansTableProps> = ({ loans, loading }) => (
  <div className="flex flex-col mb-10 border border-solid rounded border-gray-50 px-6 py-12">
    <div className="flex justify-between items-center mb-3 md:mb-6">
      <Paragraph className="text-base font-medium">
        {t(translations.fixedInterestPage.openLoansTable.title)}
      </Paragraph>
    </div>

    <div className="bg-gray-80 py-4 px-4 rounded">
      <Table
        columns={COLUMNS_CONFIG}
        rows={loans}
        rowTitle={generateRowTitle}
        className="text-gray-10 lg:px-6 lg:py-4 text-xs"
        noData={t(translations.common.tables.noData)}
        isLoading={loading}
        dataAttribute="borrow-assets-table"
      />
    </div>
  </div>
);
