import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { ProposalProps, ProposalState } from '../../BitocracyPage.types';
import { shouldProposalBeDefeated } from '../../BitocracyPage.utils';
import { useProposalStatus } from '../../hooks/useProposalStatus';
import { getStatusIcon } from '../Proposals/Proposals.utils';

type ProposalStatusProps = ProposalProps & {
  className?: string;
  isProposalDetail?: boolean;
};
export const ProposalStatus: FC<ProposalStatusProps> = ({
  proposal,
  className,
  isProposalDetail = false,
}) => {
  const status = useProposalStatus(proposal);

  const activeProposalDetailMessage = useMemo(() => {
    if (!isProposalDetail || status !== ProposalState.Active) {
      return null;
    }

    return shouldProposalBeDefeated(proposal)
      ? t(translations.bitocracyPage.proposalStatusDetail.willBeDefeated)
      : t(translations.bitocracyPage.proposalStatusDetail.willSucceed);
  }, [isProposalDetail, proposal, status]);

  return (
    <div className={classNames('flex items-start', className)}>
      {getStatusIcon(status)}
      <Paragraph
        className={`${
          status !== ProposalState.Active && 'text-gray-40'
        } font-semibold`}
        children={
          <>
            <div>
              {t(
                translations.bitocracyPage.proposalStatus[
                  ProposalState[status].toLowerCase()
                ],
              )}
            </div>
            <div>{activeProposalDetailMessage}</div>
          </>
        }
      />
    </div>
  );
};
