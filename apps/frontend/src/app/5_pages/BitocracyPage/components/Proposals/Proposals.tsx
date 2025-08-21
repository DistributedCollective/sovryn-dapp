import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { ProposalTable } from './ProposalTable';

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
  const isActive = useMemo(() => activeProposals.length > 0, [activeProposals]);

  return (
    <>
      {isActive && (
        <div className="md:mt-12 mt-4 w-full sm:p-6 sm:border sm:border-gray-50 rounded sm:bg-gray-90 mb-8">
          <Paragraph className="text-base font-medium mb-3 md:mb-6">
            {t(translations.bitocracyPage.liveProposals)}
          </Paragraph>

          <ProposalTable proposals={activeProposals} loading={loading} />
        </div>
      )}

      <div className="w-full sm:p-6 sm:border sm:border-gray-50 rounded sm:bg-gray-90 mb-8">
        <Paragraph className="text-base font-medium mb-3 md:mb-6">
          {t(translations.bitocracyPage.pastProposals)}
        </Paragraph>

        <ProposalTable proposals={pastProposals} loading={loading} />
      </div>
    </>
  );
};
