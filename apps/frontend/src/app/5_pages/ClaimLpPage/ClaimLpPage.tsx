import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonStyle,
  Heading,
  Link,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useAccount } from '../../../hooks/useAccount';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { ABOUT_LP_URL, CAMPAIGN_URL } from './ClaimLpPage.constants';
import { ClaimableItem } from './components/ClaimableItem';
import { Claim, useClaimLp } from './hooks/useClaimLp';

const ClaimLpPage: FC = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [claimable, setClaimable] = useState<Claim[]>([]);

  const { claim, getUnclaimed } = useClaimLp();
  const { checkMaintenance, States } = useMaintenance();
  const isClaimLocked = checkMaintenance(States.BOB_CLAIM_LP_DEPOSIT);

  const canClaim = useMemo(
    () =>
      chainId === BOB_CHAIN_ID &&
      claimable.length > 0 &&
      !loading &&
      !isClaimLocked,
    [chainId, claimable.length, loading, isClaimLocked],
  );

  const handleClaim = useCallback(() => {
    setLoading(true);
    claim().then(() => {
      setLoading(false);
      // Refresh the claimable list
      getUnclaimed().then(setClaimable);
    });
  }, [claim, getUnclaimed]);

  useEffect(() => {
    getUnclaimed().then(setClaimable);
  }, [getUnclaimed, account]);

  return (
    <>
      <Helmet>
        <title>{t(translations.claimLpPage.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10 mb-4">
        <NetworkBanner
          requiredChainId={BOB_CHAIN_ID}
          childClassName="flex flex-col items-center text-gray-10"
          outerClassName="w-full"
        >
          <Heading className="text-base sm:text-2xl font-medium mt-6 mb-12">
            {t(translations.claimLpPage.title)}
          </Heading>
          <Paragraph
            size={ParagraphSize.base}
            className="mt-2.5 sm:mt-4 sm:text-base font-medium text-center"
          >
            {t(translations.claimLpPage.subtitle)}
          </Paragraph>

          <div className="flex lg:flex-row flex-col items-center justify-around mt-6">
            <Button
              style={ButtonStyle.secondary}
              text={t(translations.claimLpPage.checkLeaderboard)}
              loading={loading}
              onClick={() => navigate('/bob-lp-points')}
            />
            <Link
              href={CAMPAIGN_URL}
              text={t(translations.claimLpPage.aboutCampaign)}
              className="lg:mt-0 mt-4 lg:ml-3"
            />
          </div>

          <div className="mt-3 w-full p-0 sm:rounded sm:w-[36rem] py-6 sm:p-6 bg-gray-90">
            <Paragraph className="mb-8 px-4">
              <Trans
                t={t}
                i18nKey={translations.claimLpPage.longDescription}
                components={{
                  link: (
                    <Link
                      href={'/earn/market-making'}
                      text={t(translations.claimLpPage.descriptionValues.amm)}
                    />
                  ),
                }}
              />
            </Paragraph>

            <div className="bg-gray-80 p-4 pt-12">
              <div className="flex flex-row justify-center items-center space-x-2">
                <div className="bg-gray-70 rounded p-4 text-center h-28 flex justify-center items-center text-xs">
                  {t(translations.claimLpPage.originalDeposit)}
                </div>
                <div>
                  <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
                    <path
                      d="M1 3.5C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5L1 3.5ZM27.3536 4.35356C27.5488 4.15829 27.5488 3.84171 27.3536 3.64645L24.1716 0.464468C23.9763 0.269206 23.6597 0.269206 23.4645 0.464468C23.2692 0.65973 23.2692 0.976313 23.4645 1.17157L26.2929 4L23.4645 6.82843C23.2692 7.02369 23.2692 7.34027 23.4645 7.53554C23.6597 7.7308 23.9763 7.7308 24.1716 7.53554L27.3536 4.35356ZM1 4.5L27 4.5L27 3.5L1 3.5L1 4.5Z"
                      fill="#24BFB7"
                    />
                  </svg>
                </div>
                <div className="flex flex-col justify-center items-center relative">
                  <div className="absolute -top-6 text-xs">
                    {t(translations.claimLpPage.claimableTitle)}
                  </div>
                  <div className="border border-[#24BFB7] p-2 rounded">
                    <div className="bg-gray-70 rounded p-4 mb-2 text-center text-xs">
                      {t(translations.claimLpPage.claimable1)}
                    </div>
                    <div className="bg-gray-70 rounded p-4 text-center text-xs">
                      {t(translations.claimLpPage.claimable2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {claimable.map(item => (
                <ClaimableItem key={item.index} item={item} />
              ))}
            </div>

            <div className="rounded bg-gray-60 p-4 mt-6">
              <Paragraph>
                <Trans
                  i18nKey={t(translations.claimLpPage.eSovDescription)}
                  components={[
                    <Button
                      style={ButtonStyle.ghost}
                      text={t(translations.claimLpPage.leaderboard)}
                      onClick={() => navigate('/bob-lp-points')}
                    />,
                  ]}
                />
              </Paragraph>
            </div>
            <div className="mt-2 text-center">
              <Button
                text={t(translations.claimLpPage.cta)}
                className="grow-0 shrink w-full max-w-48"
                disabled={!canClaim}
                loading={loading}
                onClick={handleClaim}
              />
            </div>
            <div className="mt-1 text-center">
              <Link
                href={ABOUT_LP_URL}
                text={t(translations.claimLpPage.readMore)}
              />
            </div>
          </div>
        </NetworkBanner>
      </div>
    </>
  );
};

export default ClaimLpPage;
