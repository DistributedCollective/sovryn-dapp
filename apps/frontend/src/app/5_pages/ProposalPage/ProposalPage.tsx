import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { TxIdWithNotification } from '../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { ProposalVotingResults } from '../../3_organisms/ProposalVotingResults';
import { useGetProtocolContract } from '../../../hooks/useGetContract';
import { translations } from '../../../locales/i18n';
import { areAddressesEqual } from '../../../utils/helpers';
import { ProposalStatus } from '../BitocracyPage/components/ProposalStatus/ProposalStatus';
import { parseProposalInfo } from './ProposalPage.utils';
import { CastVote } from './components/CastVote/CastVote';
import { ExecutableDetails } from './components/ExecutableDetails/ExecutableDetails';
import { ProposalInfo } from './components/ProposalInfo/ProposalInfo';
import { VoteTimer } from './components/VoteTimer/VoteTimer';
import { useGetProposalById } from './hooks/useGetProposalById';

const pageTranslations = translations.proposalPage;

const ProposalPage: FC = () => {
  let { id } = useParams();

  const adminAddress = useGetProtocolContract('governorAdmin')?.address ?? '';
  const ownerAddress = useGetProtocolContract('governorOwner')?.address ?? '';

  const { proposal } = useGetProposalById(id || '');

  const proposalInfo = useMemo(() => {
    return parseProposalInfo(proposal);
  }, [proposal]);

  const proposerType = useMemo(() => {
    if (!proposal) {
      return;
    }

    if (areAddressesEqual(proposal.emittedBy.id, adminAddress)) {
      return t(translations.bitocracyPage.proposalType.admin) + '-';
    } else if (areAddressesEqual(proposal.emittedBy.id, ownerAddress)) {
      return t(translations.bitocracyPage.proposalType.owner) + '-';
    }
  }, [adminAddress, ownerAddress, proposal]);

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-row gap-20 text-left text-gray-10 mt-6 sm:mt-16 max-w-7xl">
        <div className="w-2/3 flex flex-col gap-6">
          <div className="px-6 pb-6">
            <Heading className="text-base sm:text-2xl font-medium">
              {proposalInfo.title}
            </Heading>
            <Paragraph
              size={ParagraphSize.small}
              className="mt-2.5 sm:mt-3 font-medium text-gray-30"
            >
              {proposalInfo.summary}
            </Paragraph>
            <Paragraph
              size={ParagraphSize.base}
              className="mt-2.5 sm:mt-6 text-xs font-medium text-gray-30"
            >
              <span className="inline-block w-20">
                {t(pageTranslations.proposedBy)}
              </span>

              {proposal?.proposer && (
                <TxIdWithNotification
                  href=""
                  value={proposal?.proposer}
                  dataAttribute="stability-pool-history-address-id"
                />
              )}
            </Paragraph>
            <Paragraph
              size={ParagraphSize.base}
              className="mt-1 text-xs font-medium text-gray-30"
            >
              <span className="inline-block w-20">
                {t(pageTranslations.proposalID)}
              </span>
              {proposerType}
              {proposal?.proposalId}
            </Paragraph>
          </div>

          {proposal && (
            <>
              <CastVote proposal={proposal} />
              <ProposalInfo
                link={proposalInfo.link}
                description={proposalInfo.description}
              />
              <ExecutableDetails proposal={proposal} />
            </>
          )}
        </div>
        <div className="w-1/3">
          {proposal && (
            <>
              <div className="mb-20 flex gap-10">
                <div>
                  <Paragraph
                    size={ParagraphSize.small}
                    className="mb-3 font-xs text-gray-30"
                  >
                    {t(pageTranslations.status)}
                  </Paragraph>

                  <ProposalStatus proposal={proposal} />
                </div>

                <VoteTimer proposal={proposal} />
              </div>
              <ProposalVotingResults proposal={proposal} />
            </>
          )}
        </div>
        {/* {account && (
          <div className="flex w-full items-center sm:justify-end justify-center">
            <Button
              style={ButtonStyle.ghost}
              text={t(pageTranslations.actions.bitocracyAlerts)}
              className="mb-3 sm:mb-0"
            />
            {isNewProposalButtonVisible && (
              <div className="bg-gray-90 sm:bg-transparent p-4 pb-8 sm:p-0 border-t sm:border-none border-gray-60 flex items-center justify-center sm:ml-3 sm:relative fixed bottom-0 left-0 right-0 z-10 sm:z-0">
                <Button
                  text={t(pageTranslations.actions.newProposal)}
                  className="w-full sm:w-auto"
                />
              </div>
            )}
          </div>
        )} */}
      </div>
    </>
  );
};

export default ProposalPage;
