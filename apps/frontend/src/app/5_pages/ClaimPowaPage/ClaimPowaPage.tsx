import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';

import {
  Button,
  Checkbox,
  Heading,
  Link,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { isRskChain } from '../../../utils/chain';
import {
  ABOUT_POWA_URL,
  CAMPAIGN_URL,
  FINAL_AIRDROP_DATE,
  FIRST_AIRDROP_DATE,
  SECOND_AIRDROP_DATE,
  SUBMIT_WALLET_URL,
} from './ClaimPowaPage.constants';
import { Claim, useClaimPowa } from './hooks/useClaimPowa';

const ClaimPowaPage: FC = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const [loading, setLoading] = useState(false);
  const [claimable, setClaimable] = useState<Claim[]>([]);
  const { claim, getUnclaimed } = useClaimPowa();
  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const canClaim = useMemo(
    () =>
      isRskChain(chainId) &&
      claimable.length > 0 &&
      !loading &&
      hasDisclaimerBeenChecked,
    [chainId, claimable.length, loading, hasDisclaimerBeenChecked],
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
      <div className="w-full flex flex-col items-center text-gray-10 mt-9 mb-12">
        <Heading className="text-base sm:text-2xl font-medium">
          {t(translations.claimPowaPage.title)}
        </Heading>
        <Paragraph
          size={ParagraphSize.base}
          className="mt-2.5 sm:mt-4 font-medium text-center"
          children={t(translations.claimPowaPage.subtitle)}
        />

        <Link
          href={CAMPAIGN_URL}
          text={t(translations.claimPowaPage.aboutCampaign)}
          className="mt-4"
        />

        <div className="mt-4 w-full rounded sm:w-[30rem] p-4 bg-gray-90 font-medium ">
          <Paragraph
            className="text-xs text-gray-30"
            children={t(
              translations.claimPowaPage.descriptionValues.aboutClaiming,
            )}
          />
          <div className="text-center my-2">
            <div className="inline-flex flex-col text-left">
              <Paragraph
                className="text-xs text-gray-30 leading-5"
                children={t(
                  translations.claimPowaPage.descriptionValues.firstAirdrop,
                  {
                    firstAirdropDate:
                      dayjs(FIRST_AIRDROP_DATE).format('DD.MM.YY'),
                  },
                )}
              />
              <Paragraph
                className="text-xs text-gray-30 leading-5"
                children={t(
                  translations.claimPowaPage.descriptionValues.secondAirdrop,
                  {
                    secondAirdropDate:
                      dayjs(SECOND_AIRDROP_DATE).format('DD.MM.YY'),
                  },
                )}
              />
              <Paragraph
                className="text-xs text-gray-30 leading-5"
                children={t(
                  translations.claimPowaPage.descriptionValues.finalAirdrop,
                  {
                    finalAirdropDate:
                      dayjs(FINAL_AIRDROP_DATE).format('DD.MM.YY'),
                  },
                )}
              />
            </div>
          </div>
          <div className="text-xs text-gray-30 mb-5">
            <Trans
              i18nKey={t(
                translations.claimPowaPage.descriptionValues.rskAddress,
                {
                  date: dayjs(FINAL_AIRDROP_DATE).format('DD.MM.YY'),
                },
              )}
              components={[
                <Link
                  text={t(
                    translations.claimPowaPage.descriptionValues.rskAddressCTA,
                  )}
                  href={SUBMIT_WALLET_URL}
                />,
              ]}
            />
          </div>
          <div className="bg-gray-70 rounded p-3 mb-2.5">
            <Paragraph
              className="text-xs text-gray-30 leading-5"
              children={t(translations.claimPowaPage.longDescription)}
            />
          </div>
          <div className="my-2.5">
            <Checkbox
              checked={hasDisclaimerBeenChecked}
              onChangeValue={setHasDisclaimerBeenChecked}
              label={t(translations.claimPowaPage.disclaimer)}
            />
          </div>
          <div className="mb-4 text-center">
            <Button
              text={t(translations.claimPowaPage.claimDeposits)}
              className="grow-0 shrink w-full max-w-48"
              disabled={!canClaim}
              loading={loading}
              onClick={handleClaim}
            />
          </div>
          <div className="text-center">
            <Link
              href={ABOUT_POWA_URL}
              text={t(translations.claimPowaPage.readMore)}
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimPowaPage;
