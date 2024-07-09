import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';

import {
  Button,
  ButtonSize,
  Heading,
  Link,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import {
  ABOUT_POWA_URL,
  SUBMIT_WALLET_URL,
  TELEGRAM_POWA_URL,
} from './ClaimPowaPage.constants';
import iconPowa from './assets/powa.svg';

const ClaimPowaPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.claimPowaPage.meta.title)}</title>
    </Helmet>
    <div className="w-full flex flex-col items-center text-gray-10 mt-7 mb-12">
      <Heading className="text-base sm:text-2xl font-medium">
        {t(translations.claimPowaPage.title)}
      </Heading>
      <Paragraph
        size={ParagraphSize.base}
        className="mt-2.5 sm:mt-3 font-medium text-center"
        children={t(translations.claimPowaPage.subtitle)}
      />

      <div className="mt-12 w-full rounded sm:w-[32rem] p-4 bg-gray-90 font-medium">
        <div className="flex items-start">
          <img
            src={iconPowa}
            alt={t(translations.claimPowaPage.title)}
            className="mr-3"
          />

          <div>
            <Paragraph
              className="text-xs text-gray-30 leading-5 mb-2"
              children={t(
                translations.claimPowaPage.descriptionValues.aboutClaiming,
              )}
            />
            <div className="text-xs text-gray-30 mb-2">
              <Trans
                i18nKey={t(
                  translations.claimPowaPage.descriptionValues.rskAddress,
                )}
                components={[
                  <Link
                    text={t(
                      translations.claimPowaPage.descriptionValues
                        .rskAddressCTA,
                    )}
                    href={SUBMIT_WALLET_URL}
                  />,
                ]}
              />
            </div>
            <div className="text-xs text-gray-30 mb-5">
              <Trans
                i18nKey={t(translations.claimPowaPage.descriptionValues.faq)}
                components={[
                  <Link
                    text={t(
                      translations.claimPowaPage.descriptionValues.faqCTA,
                    )}
                    href={TELEGRAM_POWA_URL}
                  />,
                ]}
              />
            </div>
            <div className="mb-3 text-center pr-10">
              <Button
                text={t(translations.claimPowaPage.claimPowa)}
                className="grow-0 shrink w-full max-w-60"
                disabled
                size={ButtonSize.large}
              />
            </div>
            <div className="text-center pr-10">
              <Link
                href={ABOUT_POWA_URL}
                text={t(translations.claimPowaPage.details)}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default ClaimPowaPage;
