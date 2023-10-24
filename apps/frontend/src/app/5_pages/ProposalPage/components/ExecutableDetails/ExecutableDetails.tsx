import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading, Paragraph } from '@sovryn/ui';

import { ProposalExecutableDetail } from '../../../../3_organisms/ProposalExecutableDetails/ProposalExecutableDetails';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { useIsExecutableProposal } from '../../../BitocracyPage/hooks/useIsExecutableProposal';

const pageTranslations = translations.proposalPage.executableDetails;

type ExecutableDetailsProps = {
  proposal: Proposal;
};

export const ExecutableDetails: FC<ExecutableDetailsProps> = ({ proposal }) => {
  const isExecutableProposal = useIsExecutableProposal(proposal);
  return (
    <div className="bg-gray-90 p-6 rounded">
      <Heading className="text-sm font-medium">
        {t(pageTranslations.title)}
      </Heading>
      <div className="py-1 mt-2 flex flex-col flex-wrap gap-8">
        {!isExecutableProposal ? (
          <Paragraph className="text-gray-30 font-medium">
            {t(translations.common.na)}
          </Paragraph>
        ) : (
          proposal.signatures.map((signature, i) => (
            <ProposalExecutableDetail
              key={signature}
              parameter={{
                signature: signature.split('(')[0],
                target: proposal.targets[i],
                value: proposal.values[i],
                calldata: proposal.calldatas[i],
              }}
              index={i}
            />
          ))
        )}
      </div>
    </div>
  );
};
