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

import { useAccount } from '../../../hooks/useAccount';
import { sharedState } from '../../../store/rxjs/shared-state';
import { useGetPersonalStakingStatistics } from '../StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { Proposals } from './components/Proposals/Proposals';
import { useGetProposals } from './hooks/useGetProposals';

// TODO: This is just a temporary solution until we merge new proposal PR.
const isNewProposalEnabled = false;

const pageTranslations = translations.bitocracyPage;

const BitocracyPage: FC = () => {
  const { account } = useAccount();
  const { votingPower } = useGetPersonalStakingStatistics();
  const { loading, data: proposals } = useGetProposals();

  const isNewProposalButtonVisible = useMemo(
    () =>
      votingPower && isNewProposalEnabled ? Number(votingPower) > 0 : false,
    [votingPower],
  );

  const handleAlertsClick = useCallback(
    () => sharedState.actions.openEmailNotificationSettingsDialog(),
    [],
  );

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
              onClick={handleAlertsClick}
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
        )}
        <Proposals proposals={proposals} loading={loading} />
      </div>
    </>
  );
};

export default BitocracyPage;
