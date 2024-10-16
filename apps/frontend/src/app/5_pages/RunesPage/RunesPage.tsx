import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Heading, Icon, IconNames, Link, Paragraph } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { WIKI_LINKS } from '../../../constants/links';
import { translations } from '../../../locales/i18n';
import { sharedState } from '../../../store/rxjs/shared-state';
import { AVAILABLE_RUNES, RUNES_REQUEST_EMAIL } from './RunesPage.constants';
import { RUNES_USE_CASE_ACTIONS } from './RunesPage.types';
import {
  renderAvailableRunes,
  renderRuneBenefits,
  renderRunesUseCases,
} from './RunesPage.utils';

const pageTranslations = translations.runesPage;

export const RunesPage: FC = () => {
  const navigate = useNavigate();
  const handleBridgeRunes = useCallback(() => {
    sharedState.actions.openRuneBridgeDialog();
  }, []);

  const handleRuneAction = useCallback(
    (action: RUNES_USE_CASE_ACTIONS) => {
      switch (action) {
        case RUNES_USE_CASE_ACTIONS.convert:
          return navigate(
            `/convert?from=${AVAILABLE_RUNES.POWA.symbol}&categoryFrom=Runes`,
          );
        case RUNES_USE_CASE_ACTIONS.deposit:
          return navigate('/earn/market-making');
        default:
          console.error('Unexpected action:', action);
          return;
      }
    },
    [navigate],
  );

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <div className="container lg:max-w-[51rem] mx-auto my-9">
        <NetworkBanner requiredChainId={BOB_CHAIN_ID}>
          <div className="flex lg:flex-row flex-col gap-11 justify-between items-start">
            <div className="lg:max-w-[25rem]">
              <Heading className="text-2xl sm:text-3xl font-medium sm:mb-9 mb-4 text-center lg:text-left">
                {t(pageTranslations.title)}
              </Heading>
              <div className="text-base sm:text-md text-gray-30 leading-5 font-semibold">
                <Trans
                  i18nKey={t(pageTranslations.subtitle)}
                  className="text-gray-30"
                  components={[
                    <Link
                      text={t(pageTranslations.subtitleCTA)}
                      href={WIKI_LINKS.RUNES}
                      className="no-underline text-base sm:text-md"
                    />,
                  ]}
                />
              </div>
            </div>
            <div className="flex flex-col bg-gray-80 rounded p-5 justify-between w-full">
              <Paragraph
                className="text-gray-30 text-center font-medium text-base"
                children={t(pageTranslations.availableRunes)}
              />
              <div className="flex justify-center gap-3 my-6 flex-wrap px-6">
                {renderAvailableRunes()}
              </div>

              <div className="flex items-start justify-center mb-4">
                <Button
                  text={t(pageTranslations.bridgeRunes)}
                  onClick={handleBridgeRunes}
                  className="mr-1"
                />
                <Link
                  text={<Icon icon={IconNames.INFO} size={12} />}
                  href={WIKI_LINKS.BRIDGE_RUNES}
                  className="text-sov-white hover:text-gray-30"
                />
              </div>

              <Link
                text={t(pageTranslations.availableRunesInfo)}
                href={RUNES_REQUEST_EMAIL}
                className="no-underline text-center"
              />
            </div>
          </div>

          <div className="mt-11">
            <Paragraph
              className="font-medium mb-6 text-2xl leading-6"
              children={t(pageTranslations.benefits.title)}
            />
            <div className="text-base sm:text-md text-gray-30 leading-5 font-medium mt-4 flex flex-row gap-6 flex-wrap lg:flex-nowrap">
              {renderRuneBenefits()}
            </div>
          </div>

          <div className="mt-11">
            <Paragraph
              className="font-medium mb-6 text-2xl leading-6"
              children={t(pageTranslations.runesUseCases.title)}
            />
            <div className="rounded bg-gray-80 text-base sm:text-md text-gray-30 leading-5 font-medium mt-4 flex sm:flex-row flex-col gap-6 p-6 flex-wrap lg:flex-nowrap">
              {renderRunesUseCases(handleRuneAction)}
            </div>
          </div>

          <div className="mt-11 bg-gray-90 rounded p-6">
            <Paragraph
              className="text-gray-10 font-medium mb-6 text-2xl"
              children={t(pageTranslations.startEarning.title)}
            />
            <Paragraph
              className="text-gray-30 leading-5 font-medium"
              children={t(pageTranslations.startEarning.subtitle)}
            />
          </div>
        </NetworkBanner>
      </div>
    </>
  );
};

export default RunesPage;
