import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Heading,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
  TooltipTrigger,
  Tooltip,
} from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { ProposalState } from '../../../BitocracyPage/BitocracyPage.types';
import { useProposalStatus } from '../../../BitocracyPage/hooks/useProposalStatus';
import { useGetPersonalStakingStatistics } from '../../../StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { VoteType } from '../../ProposalPage.types';
import { useGetUserVote } from '../../hooks/useGetUserVote';
import { useVote } from '../../hooks/useVote';

const pageTranslations = translations.proposalPage;

type CastVoteProps = {
  className?: string;
  proposal: Proposal;
};

export const CastVote: FC<CastVoteProps> = ({ proposal, className }) => {
  const { votingPower } = useGetPersonalStakingStatistics();
  const { account } = useAccount();
  const status = useProposalStatus(proposal);
  const { vote: hasUserVoted, loading, refetch } = useGetUserVote(proposal.id);

  const { submit } = useVote(proposal, refetch);

  const hasVotingPower = useMemo(
    () => (votingPower ? Number(votingPower) > 0 : false),
    [votingPower],
  );

  const handleSupport = useCallback(() => submit(VoteType.Support), [submit]);
  const handleReject = useCallback(() => submit(VoteType.Reject), [submit]);

  const content = useMemo(() => {
    if (!account) {
      return (
        <Paragraph
          size={ParagraphSize.base}
          className="text-xs italic font-medium leading-relaxed"
        >
          <Trans i18nKey={pageTranslations.connectMessage} />
        </Paragraph>
      );
    }

    if (loading) {
      return null;
    }

    const ineligibleVote = status === ProposalState.Active && !hasVotingPower;

    if (!!hasUserVoted) {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8">
          <Tooltip
            content={
              <span className="font-medium">
                {t(pageTranslations.supportText)}
              </span>
            }
            trigger={TooltipTrigger.click}
            disabled={!hasUserVoted.support}
            className="w-full sm:w-52"
          >
            <div>
              <Button
                className={classNames('w-full', {
                  'bg-gray-50': !!hasUserVoted.support,
                  'hover:bg-gray-80 focus:bg-gray-80 cursor-default':
                    !hasUserVoted.support,
                })}
                style={ButtonStyle.secondary}
                size={ButtonSize.large}
                text={
                  <span className="flex items-center">
                    <Icon
                      className="mr-2.5 text-positive"
                      size={14}
                      icon={IconNames.CHECK}
                    />
                    {t(pageTranslations.support)}
                  </span>
                }
              />
            </div>
          </Tooltip>

          <Tooltip
            content={
              <span className="font-medium">
                {t(pageTranslations.rejectText)}
              </span>
            }
            trigger={TooltipTrigger.click}
            disabled={!!hasUserVoted.support}
            className="w-full sm:w-52"
          >
            <div>
              <Button
                className={classNames('w-full', {
                  'bg-gray-50': !hasUserVoted.support,
                  'hover:bg-gray-80 focus:bg-gray-80 cursor-default':
                    !!hasUserVoted.support,
                })}
                style={ButtonStyle.secondary}
                size={ButtonSize.large}
                text={
                  <span className="flex items-center">
                    <Icon
                      className="mr-2.5 text-negative"
                      size={12}
                      icon={IconNames.X_MARK}
                    />
                    {t(pageTranslations.reject)}
                  </span>
                }
              />
            </div>
          </Tooltip>
        </div>
      );
    }

    if (ineligibleVote) {
      return (
        <div className="flex items-center justify-between">
          <Paragraph
            size={ParagraphSize.base}
            className="text-xs italic font-medium leading-relaxed"
          >
            {t(pageTranslations.ineligibleVote)}
            <br />
            {t(pageTranslations.eligibleVote)}
          </Paragraph>

          <Link to="/earn/staking" className="no-underline">
            <Button
              style={ButtonStyle.secondary}
              size={ButtonSize.large}
              text={t(pageTranslations.stakeSOV)}
            />
          </Link>
        </div>
      );
    }

    if (!hasUserVoted && status === ProposalState.Active) {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8">
          <Button
            className="w-full sm:w-52"
            style={ButtonStyle.secondary}
            size={ButtonSize.large}
            onClick={handleSupport}
            text={
              <span className="flex items-center">
                <Icon
                  className="mr-2.5 text-positive"
                  size={14}
                  icon={IconNames.CHECK}
                />
                {t(pageTranslations.support)}
              </span>
            }
          />

          <Button
            className="w-full sm:w-52"
            style={ButtonStyle.secondary}
            size={ButtonSize.large}
            onClick={handleReject}
            text={
              <span className="flex items-center">
                <Icon
                  className="mr-2.5 text-negative"
                  size={12}
                  icon={IconNames.X_MARK}
                />
                {t(pageTranslations.reject)}
              </span>
            }
          />
        </div>
      );
    }

    if (!hasUserVoted && status !== ProposalState.Active) {
      return (
        <Paragraph
          size={ParagraphSize.base}
          className="text-xs italic font-medium leading-relaxed"
        >
          <Trans i18nKey={pageTranslations.noVote} />
        </Paragraph>
      );
    }
  }, [
    account,
    handleReject,
    handleSupport,
    hasUserVoted,
    hasVotingPower,
    loading,
    status,
  ]);

  return (
    <div className={classNames('bg-gray-80 p-6 rounded', className)}>
      <Heading className="text-sm font-medium">
        {t(pageTranslations.castVote)}
      </Heading>
      <div className="mt-8">{content}</div>
    </div>
  );
};
