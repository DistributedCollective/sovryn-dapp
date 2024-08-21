import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Icon, IconNames, Paragraph } from '@sovryn/ui';

import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { renderProposalEndDate } from '../../BitocracyPage.utils';
import { ProposalStatus } from '../ProposalStatus/ProposalStatus';
import { ProposalType } from '../ProposalType/ProposalType';

type ProposalCardsMobileProps = {
  proposals: Proposal[];
  isLoading: boolean;
};

export const ProposalCardsMobile: FC<ProposalCardsMobileProps> = ({
  proposals,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { value: blockNumber } = useBlockNumber();

  const handleCardClick = useCallback(
    (proposal: Proposal) => navigate(`/bitocracy/${proposal.id}`),
    [navigate],
  );

  const renderProposals = () => {
    if (!proposals || proposals.length === 0) {
      return (
        <>
          {isLoading ? (
            Array.from(Array(4).keys()).map(i => (
              <div key={i} className="relative text-center my-1">
                <span className="h-10 block bg-gray-50 rounded animate-pulse" />
              </div>
            ))
          ) : (
            <div className="text-center italic my-1">
              {t(translations.common.tables.noData)}
            </div>
          )}
        </>
      );
    }

    return proposals.map(proposal => (
      <div
        key={proposal.id}
        className="rounded p-4 bg-gray-70 mb-2 relative"
        onClick={() => handleCardClick(proposal)}
      >
        <Icon
          icon={IconNames.ARROW_UP}
          size={8}
          className="absolute right-5 top-5 rotate-90"
        />
        <ProposalStatus proposal={proposal} blockNumber={blockNumber} />
        <Paragraph
          children={proposal.description}
          className="truncate m-0 font-medium text-base mt-4 mb-2"
        />
        <div className="text-gray-30 text-xs flex items-center justify-between mb-1">
          <span>{t(translations.bitocracyPage.table.type)}</span>
          <span>
            <ProposalType proposal={proposal} />
          </span>
        </div>
        <div className="text-gray-30 text-xs flex items-center justify-between">
          <span>{t(translations.bitocracyPage.table.endDate)}</span>
          <span>{renderProposalEndDate(proposal)}</span>
        </div>
      </div>
    ));
  };

  return <>{renderProposals()}</>;
};
