import React, { FC, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Heading,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { ProposalState } from '../../../BitocracyPage/BitocracyPage.types';
import { useProposalStatus } from '../../../BitocracyPage/hooks/useProposalStatus';
import { useGetPersonalStakingStatistics } from '../../../StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';

const pageTranslations = translations.proposalPage;

type CastVoteProps = {
  className?: string;
  proposal: Proposal;
};

export const CastVote: FC<CastVoteProps> = ({ proposal, className }) => {
  const { votingPower } = useGetPersonalStakingStatistics();
  const status = useProposalStatus(proposal);

  const hasVotingPower = useMemo(
    () => (votingPower ? Number(votingPower) > 0 : false),
    [votingPower],
  );

  const ineligibleVote = useMemo(
    () => status === ProposalState.Active && !hasVotingPower,
    [hasVotingPower, status],
  );

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
              <Trans i18nKey={pageTranslations.ineligibleVote} />
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

        <Paragraph
          size={ParagraphSize.base}
          className="text-xs italic font-medium leading-relaxed"
        >
          <Trans i18nKey={pageTranslations.noVote} />
        </Paragraph>
      </div>
    </div>
  );
};
