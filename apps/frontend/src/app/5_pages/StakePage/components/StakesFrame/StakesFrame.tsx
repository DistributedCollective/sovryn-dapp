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
import { NewStakeRenderer } from '../NewStakeRenderer/NewStakeRenderer';
import { COLUMNS_CONFIG } from './StakesFrame.constants';
import { StakingType } from './StakesFrame.types';
import { generateRowTitle } from './StakesFrame.utils';
import { useGetStakes } from './hooks/useGetStakes';

const pageSize = DEFAULT_STAKES_SIZE;

export const StakesFrame: FC = () => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();

  const [page, setPage] = useState(0);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'lockedUntil',
    orderDirection: OrderDirection.Asc,
  });

  const { data, loading, refetch } = useGetStakes(
    account,
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const stakes = useMemo(() => (data?.stakes as StakingType[]) || [], [data]);

  const onPageChange = useCallback(
    (value: number) => {
      if (stakes.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, stakes.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && stakes?.length < pageSize,
    [loading, stakes],
  );

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  return (
    <div className="flex flex-col mb-10">
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <Paragraph className="text-base font-medium">
          {t(translations.stakePage.table.stakes)}
        </Paragraph>
        <div className="md:inline-block hidden">
          <NewStakeRenderer />
        </div>
      </div>

      <div className="md:bg-gray-80 md:py-4 md:px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={COLUMNS_CONFIG}
          rows={stakes}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="text-gray-10 lg:px-6 lg:py-4"
          noData={
            account
              ? t(translations.stakePage.table.noStakes)
              : t(translations.stakePage.table.notConnected)
          }
          dataAttribute="stakes-table"
        />
        {account && (
          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="stakes-pagination"
          />
        )}
      </div>
    </div>
  );
};
