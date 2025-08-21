import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Button,
  ButtonStyle,
  Heading,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { LoaderWithLogo } from '../../1_atoms/LoaderWithLogo/LoaderWithLogo';
import { TxIdWithNotification } from '../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { ProposalVotingPower } from '../../3_organisms/ProposalVotingPower/ProposalVotingPower';
import { ProposalVotingResults } from '../../3_organisms/ProposalVotingResults/ProposalVotingResults';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useGetProtocolContract } from '../../../hooks/useGetContract';
import { translations } from '../../../locales/i18n';
import { areAddressesEqual } from '../../../utils/helpers';
import { ProposalState } from '../BitocracyPage/BitocracyPage.types';
import { ProposalStatus } from '../BitocracyPage/components/ProposalStatus/ProposalStatus';
import { useProposalStatus } from '../BitocracyPage/hooks/useProposalStatus';
import { parseProposalInfo } from './ProposalPage.utils';
import { CastVote } from './components/CastVote/CastVote';
import { ExecutableDetails } from './components/ExecutableDetails/ExecutableDetails';
import { ProposalAction } from './components/ProposalAction/ProposalAction';
import { ProposalInfo } from './components/ProposalInfo/ProposalInfo';
import { VoteTimer } from './components/VoteTimer/VoteTimer';
import { useGetProposalById } from './hooks/useGetProposalById';

const pageTranslations = translations.proposalPage;

const ProposalPage: FC = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { value: block } = useBlockNumber();
  const adminAddress = useGetProtocolContract('governorAdmin')?.address ?? '';
  const ownerAddress = useGetProtocolContract('governorOwner')?.address ?? '';

  const { proposal, refetch } = useGetProposalById(id || '');

  const status = useProposalStatus(proposal);

  const isVotingPowerVisible = useMemo(
    () => status === ProposalState.Active,
    [status],
  );

  const proposalInfo = useMemo(() => {
    return parseProposalInfo(proposal);
  }, [proposal]);

  const proposerType = useMemo(() => {
    if (!proposal) {
      return;
    }

    if (areAddressesEqual(proposal.emittedBy.id, adminAddress)) {
      return t(translations.bitocracyPage.proposalType.admin);
    } else if (areAddressesEqual(proposal.emittedBy.id, ownerAddress)) {
      return t(translations.bitocracyPage.proposalType.owner);
    }
  }, [adminAddress, ownerAddress, proposal]);

  const handleBack = useCallback(() => navigate('/bitocracy'), [navigate]);

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  if (!proposal) {
    return <LoaderWithLogo />;
  }

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col lg:flex-row lg:gap-5 xl:gap-20 text-left text-gray-10 mt-6 mb-5 sm:mt-16 max-w-7xl">
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <Button
            onClick={handleBack}
            style={ButtonStyle.ghost}
            className="text-gray-10 inline-flex justify-start items-center text-base font-medium cursor-pointer hover:opacity-80"
            text={
              <>
                <Icon size={12} icon={IconNames.ARROW_LEFT} className="mr-2" />
                {t(translations.header.nav.bitocracy)}
              </>
            }
          />
          <div className="lg:px-6 lg:pb-6">
            <Heading className="text-base sm:text-2xl font-medium break-words">
              {proposalInfo.title}
            </Heading>
            <div className="mt-2.5 sm:mt-3 font-medium text-gray-30 break-words">
              {proposalInfo.summary}
            </div>
            <div className="mt-2.5 sm:mt-6 text-xs font-medium text-gray-30 flex justify-between lg:justify-start">
              <span className="inline-block w-20">
                {t(pageTranslations.proposedBy)}
              </span>

              {proposal.proposer && (
                <TxIdWithNotification
                  href=""
                  value={proposal.proposer}
                  dataAttribute="proposal-proposer-address-id"
                />
              )}
            </div>
            <Paragraph
              size={ParagraphSize.base}
              className="mt-1 text-xs font-medium text-gray-30 flex justify-between lg:justify-start"
            >
              <span className="inline-block w-20">
                {t(pageTranslations.proposalID)}
              </span>
              <span className="text-gray-10">
                {proposerType ? `${proposerType}-` : ''}
                {proposal.proposalId}
              </span>
            </Paragraph>

            {proposal && (
              <div className="lg:hidden mt-6">
                <div className="flex flex-row items-start justify-between mb-2">
                  <Paragraph
                    size={ParagraphSize.small}
                    className="font-xs text-gray-30"
                  >
                    {t(pageTranslations.status)}
                  </Paragraph>

                  <div className="flex flex-col items-end">
                    <ProposalStatus
                      proposal={proposal}
                      isProposalDetail
                      blockNumber={block}
                    />
                    <ProposalAction proposal={proposal} className="mt-1" />
                  </div>
                </div>

                <VoteTimer
                  className="flex flex-row justify-between"
                  proposal={proposal}
                />
              </div>
            )}
          </div>

          <CastVote proposal={proposal} />

          <div className="lg:hidden">
            {isVotingPowerVisible && <ProposalVotingPower />}
            <ProposalVotingResults proposal={proposal} />
          </div>
          <ProposalInfo
            link={proposalInfo.link}
            description={proposalInfo.description}
          />
          <ExecutableDetails proposal={proposal} />
        </div>
        <div className="w-1/3 hidden lg:block min-w-[18rem]">
          <div className="mb-20 flex gap-10">
            <div>
              <Paragraph
                size={ParagraphSize.small}
                className="mb-3 font-xs text-gray-30"
              >
                {t(pageTranslations.status)}
              </Paragraph>

              <ProposalStatus
                proposal={proposal}
                isProposalDetail
                blockNumber={block}
              />
              <ProposalAction proposal={proposal} className="ml-4 pl-0.5" />
            </div>

            <VoteTimer proposal={proposal} />
          </div>
          {isVotingPowerVisible && <ProposalVotingPower />}
          <ProposalVotingResults proposal={proposal} />
        </div>
      </div>
    </>
  );
};

export default ProposalPage;
