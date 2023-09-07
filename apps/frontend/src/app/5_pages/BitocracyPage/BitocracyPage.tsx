import React, { FC, useMemo } from 'react';

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
import { translations } from '../../../locales/i18n';
import { useGetPersonalStakingStatistics } from '../StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import LiveProposals from './components/LiveProposals/LiveProposals';
import PastProposals from './components/PastProposals/PastProposals';

const pageTranslations = translations.bitocracyPage;

const BitocracyPage: FC = () => {
  const { account } = useAccount();
  const { votingPower } = useGetPersonalStakingStatistics();

  const isNewProposalButtonVisible = useMemo(
    () => (votingPower ? Number(votingPower) > 0 : false),
    [votingPower],
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
            />
            {isNewProposalButtonVisible && (
              <Button
                text={t(pageTranslations.actions.newProposal)}
                className="sm:ml-3 sm:relative sm:bottom-0 sm:left-0 sm:right-0 fixed bottom-6 left-4 right-7"
              />
            )}
          </div>
        )}

        <LiveProposals />
        <PastProposals />
      </div>
    </>
  );
};

export default BitocracyPage;
