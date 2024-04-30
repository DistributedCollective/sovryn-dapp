import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  Button,
  ButtonStyle,
  Heading,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { translations } from '../../../locales/i18n';
import { sharedState } from '../../../store/rxjs/shared-state';
import { NewProposalButton } from './components/NewProposalButton/NewProposalButton';
import { Proposals } from './components/Proposals/Proposals';
import { ProposalContextProvider } from './contexts/NewProposalContext';
import { useGetProposals } from './hooks/useGetProposals';

const pageTranslations = translations.bitocracyPage;

const BitocracyPage: FC = () => {
  const { account } = useAccount();
  const { invalidChain } = useRequiredChain();
  const { loading, data: proposals } = useGetProposals();

  const { value: blockNumber } = useBlockNumber();

  const activeProposals = useMemo(
    () => proposals.filter(proposal => blockNumber <= proposal.endBlock),
    [proposals, blockNumber],
  );

  const hasActiveProposal = useMemo(
    () => activeProposals.some(item => item.proposer === account),
    [account, activeProposals],
  );

  const pastProposals = useMemo(
    () => proposals.filter(proposal => blockNumber > proposal.endBlock),
    [proposals, blockNumber],
  );

  const handleAlertsClick = useCallback(
    () => sharedState.actions.openEmailNotificationSettingsDialog(),
    [],
  );

  return (
    <ProposalContextProvider>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10 md:max-w-6xl">
        <NetworkBanner
          requiredChainId={RSK_CHAIN_ID}
          childClassName="flex flex-col items-center text-gray-10"
          outerClassName="w-full"
        >
          <Heading className="text-base sm:text-2xl font-medium">
            {t(pageTranslations.title)}
          </Heading>
          <Paragraph
            size={ParagraphSize.base}
            className="mt-2.5 sm:mt-4 sm:text-base font-medium mb-9"
          >
            {t(pageTranslations.subtitle)}
          </Paragraph>

          {account && !invalidChain && (
            <div className="flex w-full items-center sm:justify-end justify-center">
              <Button
                style={ButtonStyle.ghost}
                text={t(pageTranslations.actions.bitocracyAlerts)}
                className="mb-3 sm:mb-0"
                onClick={handleAlertsClick}
              />
              <NewProposalButton hasActiveProposal={hasActiveProposal} />
            </div>
          )}
          <Proposals
            activeProposals={activeProposals}
            pastProposals={pastProposals}
            loading={loading}
          />
        </NetworkBanner>
      </div>
    </ProposalContextProvider>
  );
};

export default BitocracyPage;
