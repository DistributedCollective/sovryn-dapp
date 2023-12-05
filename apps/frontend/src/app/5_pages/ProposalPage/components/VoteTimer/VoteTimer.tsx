import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { useTimer } from 'react-timer-hook';

import { Paragraph, ParagraphSize, Tooltip } from '@sovryn/ui';

import { MS } from '../../../../../constants/general';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { BLOCK_TIME_IN_SECONDS } from '../../../BitocracyPage/BitocracyPage.constants';
import { ProposalState } from '../../../BitocracyPage/BitocracyPage.types';
import { useProposalStatus } from '../../../BitocracyPage/hooks/useProposalStatus';

const pageTranslations = translations.proposalPage;

type VoteTimerProps = {
  className?: string;
  proposal: Proposal;
};

export const VoteTimer: FC<VoteTimerProps> = ({ proposal, className }) => {
  const status = useProposalStatus(proposal);
  const { value: blockNumber } = useBlockNumber();

  const expiryTimestamp = useMemo(() => {
    const secondsBetweenBlocks =
      (proposal.endBlock - proposal.startBlock) * BLOCK_TIME_IN_SECONDS;
    return new Date((proposal.timestamp + secondsBetweenBlocks) * MS);
  }, [proposal.endBlock, proposal.startBlock, proposal.timestamp]);

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
  });

  const label = useMemo(() => {
    if (status !== ProposalState.Active) {
      return t(pageTranslations.voteEnded);
    }

    const timeArray = [days, hours, minutes, seconds];

    if (!days) {
      timeArray.shift();
    }

    if (!hours) {
      timeArray.shift();
    }

    if (!minutes) {
      timeArray.shift();
    }

    return `${timeArray
      .map(time => String(time).padStart(2, '0'))
      .join(':')} (${proposal.endBlock - blockNumber}) ${t(
      pageTranslations.blocks,
    )}`;
  }, [blockNumber, days, hours, minutes, proposal.endBlock, seconds, status]);

  return (
    <div className={className}>
      <Paragraph
        size={ParagraphSize.small}
        className="mb-3 font-xs text-gray-30"
      >
        {t(pageTranslations.timeToVote)}
      </Paragraph>

      <Paragraph
        size={ParagraphSize.small}
        className="mb-3 font-medium font-xs"
      >
        <Tooltip
          content={
            <div className="font-medium">
              <span className="font-semibold">
                {t(pageTranslations.voteStart)}
              </span>
              <br />
              <span>
                {dateFormat(proposal.timestamp)} ({t(pageTranslations.block)} #
                {proposal.startBlock})
              </span>
              <br />
              <span className="font-semibold">
                {t(pageTranslations.voteEnd)}
              </span>
              <br />
              <span>
                {dateFormat(expiryTimestamp.getTime() / MS)} (
                {t(pageTranslations.block)} #{proposal.endBlock})
              </span>
            </div>
          }
        >
          <span>{label}</span>
        </Tooltip>
      </Paragraph>
    </div>
  );
};
