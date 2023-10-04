import React, { FC, useCallback } from 'react';

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
import { sharedState } from '../../../store/rxjs/shared-state';
import { NewProposalButton } from './components/NewProposalButton/NewProposalButton';
import { Proposals } from './components/Proposals/Proposals';
import { useGetProposals } from './hooks/useGetProposals';

const pageTranslations = translations.bitocracyPage;

const BitocracyPage: FC = () => {
  const { account } = useAccount();
  const { loading, data: proposals } = useGetProposals();

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
            <NewProposalButton />
          </div>
        )}
        <Proposals proposals={proposals} loading={loading} />
      </div>
    </>
  );
};

export default BitocracyPage;
