import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Paragraph, Table } from '@sovryn/ui';

import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { generateRowTitle } from '../../BitocracyPage.utils';
import { ProposalCardsMobile } from '../ProposalCardsMobile/ProposalCardsMobile';
import { columnsConfig } from './Proposals.constants';

type ProposalsProps = {
  proposals: Proposal[];
  loading: boolean;
};

export const Proposals: FC<ProposalsProps> = ({ proposals, loading }) => {
  const navigate = useNavigate();
  const { value: blockNumber } = useBlockNumber();

  const activeProposals = useMemo(
    () => proposals.filter(proposal => blockNumber <= proposal.endBlock),
    [proposals, blockNumber],
  );

  const pastProposals = useMemo(
    () => proposals.filter(proposal => blockNumber > proposal.endBlock),
    [proposals, blockNumber],
  );

  const isActive = useMemo(() => activeProposals.length > 0, [activeProposals]);

  const handleRowClick = useCallback(
    (proposal: Proposal) => navigate(`/bitocracy/${proposal.id}`),
    [navigate],
  );

  return (
    <>
      {isActive && (
        <div className="md:mt-12 mt-4 w-full sm:p-6 sm:border sm:border-gray-50 rounded sm:bg-gray-90 mb-8">
          <Paragraph className="text-base font-medium mb-3 md:mb-6">
            {t(translations.bitocracyPage.liveProposals)}
          </Paragraph>

          <div className="bg-gray-80 p-4 rounded hidden lg:block">
            <Table
              columns={columnsConfig}
              rows={activeProposals}
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
              dataAttribute="bitocracy-live-proposals-table"
            />
          </div>

          <div className="block lg:hidden">
            <ProposalCardsMobile
              isLoading={loading}
              proposals={activeProposals}
            />
          </div>
        </div>
      )}

      {!isActive && (
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
            <ProposalCardsMobile
              isLoading={loading}
              proposals={pastProposals}
            />
          </div>
        </div>
      )}
    </>
  );
};
