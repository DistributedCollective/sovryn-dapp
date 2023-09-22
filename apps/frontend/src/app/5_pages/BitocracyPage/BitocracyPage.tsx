import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  Button,
  ButtonStyle,
  Heading,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { ProposalVotingResults } from '../../3_organisms/ProposalVotingResults';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { Proposal } from '../../../utils/graphql/rsk/generated';
import { NewProposalButton } from './components/NewProposalButton/NewProposalButton';
import { Proposals } from './components/Proposals/Proposals';
import { useGetProposals } from './hooks/useGetProposals';

const pageTranslations = translations.bitocracyPage;

// DUMMY DATA, REMOVE WHEN REAL DATA IS AVAILABLE
const proposal = {
  id: '0x6496df39d000478a7a7352c01e0e713835051ccd-32',
  votesFor: '25642394317449679336562867',
  votesAgainst: '9204395962492958076500991',
  endBlock: 5505959,
  startBlock: 5505952,
  quorum: '20928484835262004265672060',
  majorityPercentage: '73249696923417014929852210',
  emittedBy: {
    id: '0x6496df39d000478a7a7352c01e0e713835051ccd',
    majorityPercentageVotes: 70,
    quorumPercentageVotes: 20,
  },
} as Proposal;

const BitocracyPage: FC = () => {
  const { account } = useAccount();
  const { loading, data: proposals } = useGetProposals();

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10 mt-6 sm:mt-24 max-w-6xl">
        <Heading className="text-base sm:text-2xl font-medium">
          {t(pageTranslations.title)}
        </Heading>
        <Paragraph
          size={ParagraphSize.base}
          className="mt-2.5 sm:mt-4 sm:text-base font-medium mb-9"
        >
          {t(pageTranslations.subtitle)}
        </Paragraph>

        {account && (
          <div className="flex w-full items-center sm:justify-end justify-center">
            <Button
              style={ButtonStyle.ghost}
              text={t(pageTranslations.actions.bitocracyAlerts)}
              className="mb-3 sm:mb-0"
            />
            <NewProposalButton />
          </div>
        )}
        <Proposals proposals={proposals} loading={loading} />

        <div className="mt-12" />
        <ProposalVotingResults proposal={proposal} />
        <div className="mt-12" />
        <ProposalVotingResults proposal={{ ...proposal, endBlock: 0 }} />
      </div>
    </>
  );
};

export default BitocracyPage;
