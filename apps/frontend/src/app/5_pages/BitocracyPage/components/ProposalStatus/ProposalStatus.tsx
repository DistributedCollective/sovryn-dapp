import React, { FC } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { ProposalProps, ProposalState } from '../../BitocracyPage.types';
import { useProposalStatus } from '../../hooks/useProposalStatus';
import { getStatusIcon } from '../Proposals/Proposals.utils';

export const ProposalStatus: FC<ProposalProps> = ({ proposal }) => {
  const status = useProposalStatus(proposal);

  return (
    <div className="flex items-center">
      {getStatusIcon(status)}
      <Paragraph
        className={`${
          status !== ProposalState.Active && 'text-gray-40'
        } font-semibold`}
        children={t(
          translations.bitocracyPage.proposalStatus[
            ProposalState[status].toLowerCase()
          ],
        )}
      />
    </div>
  );
};
