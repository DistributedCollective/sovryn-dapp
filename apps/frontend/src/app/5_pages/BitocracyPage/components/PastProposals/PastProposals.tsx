import React, { FC, useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Paragraph, Table } from '@sovryn/ui';

import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { generateRowTitle } from '../../BitocracyPage.utils';
import { useGetProposals } from '../../hooks/useGetProposals';
import { ProposalCardsMobile } from '../ProposalCardsMobile/ProposalCardsMobile';
import { columnsConfig } from './PastProposals.constants';

const PastProposals: FC = () => {
  const navigate = useNavigate();
  const { value: blockNumber } = useBlockNumber();
  const { loading, data: proposals } = useGetProposals();
  const [pastProposals, setPastProposals] = useState<Proposal[]>([]);

  const handleRowClick = useCallback(
    (proposal: Proposal) => navigate(`/bitocracy/${proposal.proposalId}`),
    [navigate],
  );

  useEffect(() => {
    if (!loading && proposals) {
      const pastProposals = proposals.filter(
        proposal => blockNumber > proposal.endBlock,
      );
      setPastProposals(pastProposals);
    }
  }, [loading, proposals, blockNumber]);

  return (
    <div className="sm:mt-12 w-full sm:p-6 sm:border sm:border-gray-50 rounded sm:bg-gray-90 mb-8">
      <Paragraph className="text-base font-medium mb-3 md:mb-6">
        {t(translations.bitocracyPage.pastProposals)}
      </Paragraph>

      <div className="bg-gray-80 p-4 rounded hidden lg:block">
        <Table
          columns={columnsConfig}
          rows={pastProposals}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          isClickable={true}
          onRowClick={handleRowClick}
          noData={
            <span className="italic">
              {t(translations.common.tables.noData)}
            </span>
          }
          dataAttribute="bitocracy-past-proposals-table"
        />
      </div>

      <div className="block lg:hidden">
        <ProposalCardsMobile isLoading={loading} proposals={pastProposals} />
      </div>
    </div>
  );
};

export default PastProposals;
