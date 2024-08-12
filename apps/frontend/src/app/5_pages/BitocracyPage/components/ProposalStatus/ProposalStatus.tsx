import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { ProposalProps, ProposalState } from '../../BitocracyPage.types';
import { shouldProposalBeDefeated } from '../../BitocracyPage.utils';
import { useIsExecutableProposal } from '../../hooks/useIsExecutableProposal';
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
  const { value: blockNumber } = useBlockNumber();
  const status = useProposalStatus(proposal);
  const isExecutableProposal = useIsExecutableProposal(proposal);

  const activeProposalDetailMessage = useMemo(() => {
    if (!isProposalDetail || status !== ProposalState.Active) {
      return null;
    }

    return shouldProposalBeDefeated(proposal)
      ? t(translations.bitocracyPage.proposalStatusDetail.willBeDefeated)
      : t(translations.bitocracyPage.proposalStatusDetail.willSucceed);
  }, [isProposalDetail, proposal, status]);

  const statusMessage = useMemo(() => {
    if (
      [
        ProposalState.Succeeded,
        ProposalState.Queued,
        ProposalState.Executed,
      ].includes(status) &&
      !isExecutableProposal
    ) {
      return t(
        translations.bitocracyPage.proposalStatus.succeededNonExecutable,
      );
    }

    return t(
      translations.bitocracyPage.proposalStatus[
        ProposalState[status].toLowerCase()
      ],
    );
  }, [isExecutableProposal, status]);

  if (!blockNumber) {
    return <div className={className} />;
  }

  return (
    <div className={classNames('flex items-start', className)}>
      {getStatusIcon(status)}
      <Paragraph
        className={`${
          status !== ProposalState.Active && 'text-gray-40'
        } font-semibold`}
        children={
          <>
            <span>{statusMessage}</span>
            <br />
            <span>{activeProposalDetailMessage}</span>
          </>
        }
      />
    </div>
  );
};
