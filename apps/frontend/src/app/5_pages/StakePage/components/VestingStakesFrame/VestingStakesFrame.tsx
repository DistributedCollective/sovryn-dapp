import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  Table,
} from '@sovryn/ui';

import { DEFAULT_STAKES_SIZE } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { VestingContract } from '../../../../../utils/graphql/rsk/generated';
import { COLUMNS_CONFIG } from './VestingStakesFrame.constants';
import { generateRowTitle } from './VestingStakesFrame.utils';
import { useGetVestingStakes } from './hooks/useGetVestingStakes';

const pageSize = DEFAULT_STAKES_SIZE;

export const VestingStakesFrame: FC = () => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();

  const [page, setPage] = useState(0);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'createdAtTimestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetVestingStakes(
    account,
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const vestings = useMemo(
    () => (data?.vestingContracts as VestingContract[]) || [],
    [data],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (vestings.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, vestings.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && vestings?.length < pageSize,
    [loading, vestings],
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
          rows={vestings}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={
            account
              ? t(translations.stakePage.table.noVestingStakes)
              : t(translations.stakePage.table.notConnected)
          }
          dataAttribute="vesting-stakes-table"
        />
        {account && (
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="vesting-stakes-pagination"
          />
        )}
      </div>
    </div>
  );
};
