import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

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

import { useAccount } from '../../../hooks/useAccount';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { isRskChain } from '../../../utils/chain';
import { ABOUT_POWA_URL, TELEGRAM_POWA_URL } from './ClaimPowaPage.constants';
import iconPowa from './assets/powa.svg';
import { Claim, useClaimPowa } from './hooks/useClaimPowa';

const ClaimPowaPage: FC = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const [loading, setLoading] = useState(false);
  const [claimable, setClaimable] = useState<Claim[]>([]);
  const { claim, getUnclaimed } = useClaimPowa();

  const canClaim = useMemo(
    () => isRskChain(chainId) && claimable.length > 0 && !loading,
    [chainId, claimable.length, loading],
  );

  const handleClaim = useCallback(() => {
    setLoading(true);
    claim().then(() => {
      setLoading(false);
      getUnclaimed().then(setClaimable);
    });
  }, [claim, getUnclaimed]);

  useEffect(() => {
    getUnclaimed().then(setClaimable);
  }, [getUnclaimed, account]);

  return (
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
                  disabled={!canClaim}
                  loading={loading}
                  onClick={handleClaim}
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
};
export default ClaimPowaPage;
