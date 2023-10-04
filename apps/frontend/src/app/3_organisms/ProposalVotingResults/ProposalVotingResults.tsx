import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import {
  Bar,
  Button,
  ButtonStyle,
  HelperButton,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { translations } from '../../../locales/i18n';
import { Proposal } from '../../../utils/graphql/rsk/generated';
import { decimalic, formatValue } from '../../../utils/math';

export type ProposalVotingResultsProps = {
  proposal: Proposal;
  onExportCSV?: () => void;
};

export const ProposalVotingResults: FC<ProposalVotingResultsProps> = ({
  proposal,
  onExportCSV,
}) => {
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
          <Button
            text={t(translations.proposalVotingResults.exportCSV)}
            onClick={onExportCSV}
            style={ButtonStyle.secondary}
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
