import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  Bar,
  HelperButton,
  NotificationType,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { translations } from '../../../locales/i18n';
import { Proposal } from '../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../utils/helpers';
import { decimalic, formatValue, fromWei } from '../../../utils/math';

export type ProposalVotingResultsProps = {
  proposal: Proposal;
};

export const ProposalVotingResults: FC<ProposalVotingResultsProps> = ({
  proposal,
}) => {
  const { addNotification } = useNotificationContext();
  const currentBlock = useBlockNumber().value;
  const { votesFor, votesAgainst, endBlock, emittedBy, quorum } = proposal;
  const { majorityPercentageVotes, quorumPercentageVotes } = emittedBy;

  const { support, turnout, votes } = useMemo(() => {
    const votes = Decimal.fromBigNumberString(votesFor).add(
      Decimal.fromBigNumberString(votesAgainst),
    );

    const support = votes.isZero()
      ? 0
      : Decimal.fromBigNumberString(votesFor).div(votes).mul(100).toNumber();

    const turnout = votes
      .div(
        Decimal.fromBigNumberString(quorum).div(
          decimalic(quorumPercentageVotes).div(100),
        ),
      )
      .mul(100)
      .toNumber();

    return {
      votes,
      support,
      turnout,
    };
  }, [quorum, quorumPercentageVotes, votesAgainst, votesFor]);

  const exportData = useCallback(async () => {
    if (!proposal.votes || !proposal.votes.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
      return [];
    }

    return proposal.votes?.map(vote => ({
      date: dateFormat(vote.timestamp),
      address: vote.voter.id,
      vote: vote.support
        ? t(translations.proposalPage.support)
        : t(translations.proposalPage.reject),
      votingPower: fromWei(vote.votes),
      TXID: vote.transaction.id,
    }));
  }, [addNotification, proposal]);

  return (
    <div className="w-full bg-gray-90 p-6">
      <div className="flex flex-row justify-between mb-8">
        <Paragraph size={ParagraphSize.base} className="font-medium">
          {t(translations.proposalVotingResults.title)}
        </Paragraph>
        {currentBlock < endBlock ? (
          <Paragraph size={ParagraphSize.small} className="italic">
            {t(translations.proposalVotingResults.inProgress)}
          </Paragraph>
        ) : (
          <ExportCSV
            getData={exportData}
            filename="proposal-voting-results"
            disabled={!proposal.votes || !proposal.votes.length}
          />
        )}
      </div>

      <div>
        <div className="flex items-center gap-1 font-semibold text-xs">
          {t(translations.proposalVotingResults.support.title)}{' '}
          <HelperButton
            tooltipClassName="min-w-48"
            content={
              <>
                <Paragraph className="font-bold">
                  {t(translations.proposalVotingResults.support.required)}
                </Paragraph>
                <Paragraph>
                  {t(translations.proposalVotingResults.support.requiredValue, {
                    value: formatValue(majorityPercentageVotes, 3),
                  })}
                </Paragraph>
                <Paragraph className="font-bold mt-2">
                  {t(translations.proposalVotingResults.support.current)}
                </Paragraph>
                <Paragraph>
                  {t(translations.proposalVotingResults.support.currentValue, {
                    value: formatValue(support, 3),
                  })}
                </Paragraph>
              </>
            }
          />
        </div>
        <Bar value={support} threshold={majorityPercentageVotes} />
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-1 font-semibold text-xs">
          {t(translations.proposalVotingResults.quorum.title)}{' '}
          <HelperButton
            tooltipClassName="min-w-48"
            content={
              <>
                <Paragraph className="font-bold">
                  {t(translations.proposalVotingResults.quorum.required)}
                </Paragraph>
                <Paragraph>
                  {t(translations.proposalVotingResults.quorum.requiredValue, {
                    value: formatValue(Decimal.fromBigNumberString(quorum), 4),
                    percent: formatValue(quorumPercentageVotes, 3),
                  })}
                </Paragraph>
                <Paragraph className="font-bold mt-2">
                  {t(translations.proposalVotingResults.quorum.current)}
                </Paragraph>
                <Paragraph>
                  {t(translations.proposalVotingResults.quorum.currentValue, {
                    value: formatValue(votes, 4),
                    percent: formatValue(turnout, 3),
                  })}
                </Paragraph>
              </>
            }
          />
        </div>
        <Bar value={turnout} threshold={quorumPercentageVotes} />
      </div>
    </div>
  );
};
