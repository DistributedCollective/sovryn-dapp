import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Paragraph, Table } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { generateRowTitle } from '../../BitocracyPage.utils';
import { ProposalCardsMobile } from '../ProposalCardsMobile/ProposalCardsMobile';
import { columnsConfig } from './Proposals.constants';

type ProposalsProps = {
  activeProposals: Proposal[];
  pastProposals: Proposal[];
  loading: boolean;
};

export const Proposals: FC<ProposalsProps> = ({
  activeProposals,
  pastProposals,
  loading,
}) => {
  const navigate = useNavigate();

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
              noData={
                <span className="italic">
                  {t(translations.common.tables.noData)}
                </span>
              }
              dataAttribute="bitocracy-live-proposals-table"
              onRowClick={handleRowClick}
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
            noData={
              <span className="italic">
                {t(translations.common.tables.noData)}
              </span>
            }
            dataAttribute="bitocracy-past-proposals-table"
            onRowClick={handleRowClick}
          />
        </div>

        <div className="block lg:hidden">
          <ProposalCardsMobile isLoading={loading} proposals={pastProposals} />
        </div>
      </div>
    </>
  );
};
