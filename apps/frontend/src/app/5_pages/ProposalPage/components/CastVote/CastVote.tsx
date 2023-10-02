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
import { useGetUserVote } from '../../hooks/useGetUserVote';
import { useVote } from '../../hooks/useVote';

const pageTranslations = translations.proposalPage;

type CastVoteProps = {
  className?: string;
  proposal: Proposal;
  refetch: () => void;
};

export const CastVote: FC<CastVoteProps> = ({
  proposal,
  className,
  refetch,
}) => {
  const { votingPower } = useGetPersonalStakingStatistics();
  const { account } = useAccount();
  const status = useProposalStatus(proposal);
  const { vote } = useGetUserVote(proposal.id);

  const { submit } = useVote(proposal, refetch);

  const hasVotingPower = useMemo(
    () => (votingPower ? Number(votingPower) > 0 : false),
    [votingPower],
  );

  const ineligibleVote = useMemo(
    () => status === ProposalState.Active && !hasVotingPower && account,
    [account, hasVotingPower, status],
  );
  const noVote = useMemo(
    () =>
      proposal.votes?.length === 0 &&
      account &&
      status !== ProposalState.Active,
    [account, proposal.votes?.length, status],
  );
  const handleSupport = useCallback(() => submit(true), [submit]);
  const handleReject = useCallback(() => submit(false), [submit]);

  return (
    <div className={classNames('bg-gray-80 p-6 rounded', className)}>
      <Heading className="text-sm font-medium">
        {t(pageTranslations.castVote)}
      </Heading>
      <div className="mt-8">
        {ineligibleVote && (
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
        )}

        {!ineligibleVote && noVote && (
          <Paragraph
            size={ParagraphSize.base}
            className="text-xs italic font-medium leading-relaxed"
          >
            <Trans i18nKey={pageTranslations.noVote} />
          </Paragraph>
        )}

        {!account && (
          <Paragraph
            size={ParagraphSize.base}
            className="text-xs italic font-medium leading-relaxed"
          >
            <Trans i18nKey={pageTranslations.connectMessage} />
          </Paragraph>
        )}
        {!!vote && (
          <div className="flex items-center gap-8">
            <Tooltip
              content={
                <span className="font-medium">
                  {t(pageTranslations.supportText)}
                </span>
              }
              trigger={TooltipTrigger.click}
              disabled={!vote.support}
            >
              <div>
                <Button
                  className={classNames('w-52', {
                    'bg-gray-50': !!vote.support,
                    'hover:bg-gray-80 focus:bg-gray-80 cursor-default':
                      !vote.support,
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
              disabled={!!vote.support}
            >
              <div>
                <Button
                  className={classNames('w-52', {
                    'bg-gray-50': !vote.support,
                    'hover:bg-gray-80 focus:bg-gray-80 cursor-default':
                      !!vote.support,
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
        )}

        {!vote && status === ProposalState.Active && (
          <div className="flex items-center gap-8">
            <Button
              className="w-52"
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
              className="w-52"
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
        )}
      </div>
    </div>
  );
};
