import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  Table,
} from '@sovryn/ui';

import { DEFAULT_PAGE_SIZE } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './VestingStakesFrame.constants';
import { Vesting } from './VestingStakesFrame.types';
import { StakedAmountCellRenderer } from './components/StakedAmountCellRenderer';
import { useGetVestingStakes } from './hooks/useGetVestingStakes';

export const VestingStakesFrame: FC = () => {
  const { account } = useAccount();

  const [page, setPage] = useState(0);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'unlockDate',
    orderDirection: OrderDirection.Desc,
  });

  const { vestingStakes, loadingVestings } = useGetVestingStakes();

  const onPageChange = useCallback(
    (value: number) => {
      if (vestingStakes.length < DEFAULT_PAGE_SIZE && value > page) {
        return;
      }
      setPage(value);
    },
    [page, vestingStakes.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loadingVestings && vestingStakes.length < DEFAULT_PAGE_SIZE,
    [loadingVestings, vestingStakes],
  );

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  return (
    <div className="flex flex-col">
      <Paragraph className="text-base font-medium mb-3 md:mb-6">
        {t(translations.stakePage.table.vestingStakes)}
      </Paragraph>

      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={COLUMNS_CONFIG}
          rows={vestingStakes}
          rowTitle={({ vestingContract }: Vesting) => (
            <StakedAmountCellRenderer vestingContract={vestingContract} />
          )}
          isLoading={loadingVestings}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={
            <span className="italic">
              {account
                ? t(translations.stakePage.table.noVestingStakes)
                : t(translations.stakePage.table.notConnected)}
            </span>
          }
          dataAttribute="vesting-stakes-table"
        />
        {account && (
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
            onChange={onPageChange}
            itemsPerPage={DEFAULT_PAGE_SIZE}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="vesting-stakes-pagination"
          />
        )}
      </div>
    </div>
  );
};
