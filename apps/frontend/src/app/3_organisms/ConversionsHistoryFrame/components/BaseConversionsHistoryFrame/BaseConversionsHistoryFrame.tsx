import React, { PropsWithChildren, ReactNode } from 'react';

import { t } from 'i18next';

import { ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { Data } from '../../../../2_molecules/ExportCSV/ExportCSV.types';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';

type BaseConversionsHistoryFrameProps = {
  name: string;
  exportData?: () => Promise<Data[]>;
  table?: ReactNode;
  pagination?: ReactNode;
};

export const BaseConversionsHistoryFrame: React.FC<
  PropsWithChildren<BaseConversionsHistoryFrameProps>
> = ({ exportData, table, pagination, name, children }) => {
  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        {children}
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          {exportData && (
            <ExportCSV
              getData={exportData}
              filename={name}
              disabled={exportLocked}
            />
          )}
          {exportLocked && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
        </div>
      </div>
      <div className="bg-gray-80 py-4 px-4 rounded">
        {table}
        {pagination}
      </div>
    </>
  );
};
