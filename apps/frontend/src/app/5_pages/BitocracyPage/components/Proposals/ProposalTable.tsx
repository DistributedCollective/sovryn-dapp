import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Pagination, Table } from '@sovryn/ui';

import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../constants/general';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { generateRowTitle } from '../../BitocracyPage.utils';
import { ProposalCardsMobile } from '../ProposalCardsMobile/ProposalCardsMobile';
import { columnsConfig } from './Proposals.constants';

type ProposalTableProps = {
  proposals: Proposal[];
  loading: boolean;
};

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const ProposalTable: FC<ProposalTableProps> = ({
  proposals,
  loading,
}) => {
  const [page, setPage] = useState(0);
  const { value: blockNumber } = useBlockNumber();

  const navigate = useNavigate();

  const handleRowClick = useCallback(
    (proposal: Proposal) => navigate(`/bitocracy/${proposal.id}`),
    [navigate],
  );

  const onActivePageChange = useCallback(
    (value: number) => {
      if (proposals?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, proposals?.length],
  );

  const data = useMemo(
    () => proposals.slice(page * pageSize, (page + 1) * pageSize),
    [page, proposals],
  );

  return (
    <>
      <div className="bg-gray-80 p-4 rounded hidden lg:block">
        <Table
          columns={columnsConfig(blockNumber)}
          rows={data}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={
            <span className="italic">
              {t(translations.common.tables.noData)}
            </span>
          }
          dataAttribute="bitocracy-proposals-table"
          onRowClick={handleRowClick}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onActivePageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={proposals.length < pageSize}
          dataAttribute="bitocracy-proposals-pagination"
          totalItems={proposals.length}
        />
      </div>

      <div className="block lg:hidden">
        <ProposalCardsMobile isLoading={loading} proposals={data} />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onActivePageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={proposals.length < pageSize}
          dataAttribute="bitocracy-proposals-pagination"
          totalItems={proposals.length}
        />
      </div>
    </>
  );
};
