import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';

import { t } from 'i18next';

import { ErrorBadge, ErrorLevel, Pagination } from '@sovryn/ui';

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { Data } from '../../../../2_molecules/ExportCSV/ExportCSV.types';
import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../constants/general';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';

type BaseConversionsHistoryFrameProps = {
  name: string;
  exportData?: () => Promise<Data[]>;
  table?: ReactNode;
  page: number;
  setPage: (value: number) => void;
  totalItems: number;
  isLoading?: boolean;
};

export const BaseConversionsHistoryFrame: React.FC<
  PropsWithChildren<BaseConversionsHistoryFrameProps>
> = ({
  exportData,
  table,
  name,
  children,
  page,
  setPage,
  totalItems,
  isLoading,
}) => {
  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  const onPageChange = useCallback(
    (value: number) => {
      if (totalItems < DEFAULT_HISTORY_FRAME_PAGE_SIZE && value > page) {
        return;
      }
      setPage(value);
    },
    [page, setPage, totalItems],
  );

  const isNextButtonDisabled = useMemo(
    () => !isLoading && totalItems < DEFAULT_HISTORY_FRAME_PAGE_SIZE,
    [totalItems, isLoading],
  );

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
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={DEFAULT_HISTORY_FRAME_PAGE_SIZE}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute={`${name}-history-pagination`}
        />
      </div>
    </>
  );
};
