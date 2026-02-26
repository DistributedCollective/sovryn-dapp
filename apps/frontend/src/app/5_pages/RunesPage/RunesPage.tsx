import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { Button, Heading, Link, Paragraph } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { translations } from '../../../locales/i18n';
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
              <div className="text-gray-30">
                <Paragraph
                  children={t(pageTranslations.subtitle)}
                  className="mb-4 text-base sm:text-md leading-5 font-semibold"
                />
              </div>
            </div>
            <div className="flex flex-col bg-gray-80 rounded p-5 justify-between w-full">
              <Paragraph
                className="text-gray-30 text-center font-medium text-base"
                children={t(pageTranslations.availableRunes)}
              />
              <div className="flex justify-center gap-3 my-6 flex-wrap">
                {renderAvailableRunes()}
              </div>

              <div className="flex justify-center mb-4">
                <Button
                  text={t(pageTranslations.runesUseCases.actions.convert)}
                  onClick={() =>
                    handleRuneAction(RUNES_USE_CASE_ACTIONS.convert)
                  }
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
        </NetworkBanner>
      </div>
    </>
  );
};

export default RunesPage;
