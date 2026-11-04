import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Button, Heading, Paragraph } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useRequiredChain } from '../../../hooks/chain/useRequiredChain';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { translations } from '../../../locales/i18n';
import { getChainLabel } from '../../../utils/chain';
import { StakesFrame } from '../StakePage/components/StakesFrame/StakesFrame';
import { VestingStakesFrame } from '../StakePage/components/VestingStakesFrame/VestingStakesFrame';

const DelegationPage: FC = () => {
  const { invalidChain } = useRequiredChain(RSK_CHAIN_ID);
  const { wallets, switchNetwork } = useWalletConnect();
  const wrongWalletChain =
    !!wallets[0] && wallets[0].chains[0]?.id !== RSK_CHAIN_ID;

  return (
    <>
      <Helmet>
        <title>{t(translations.delegationPage.metaTitle)}</title>
      </Helmet>
      <div className="w-full max-w-6xl text-gray-10">
        <Link
          to="/bitocracy"
          className="text-primary underline hover:no-underline"
        >
          {t(translations.header.nav.bitocracy)}
        </Link>
        <Heading className="text-center mt-6 mb-4 lg:text-2xl">
          {t(translations.delegationPage.title)}
        </Heading>
        <Paragraph className="text-center mb-4">
          {t(translations.delegationPage.description)}
        </Paragraph>
        <Paragraph className="text-center text-gray-30 mb-8">
          {t(translations.delegationPage.snapshotNotice)}
        </Paragraph>
        <NetworkBanner requiredChainId={RSK_CHAIN_ID}>
          {!invalidChain && wrongWalletChain && (
            <div className="text-center">
              <Paragraph className="mb-4">
                {t('wrongNetworkSwitcher.description', {
                  network: getChainLabel(RSK_CHAIN_ID),
                })}
              </Paragraph>
              <Button
                text={t(translations.common.buttons.switch)}
                onClick={() => switchNetwork(RSK_CHAIN_ID)}
              />
            </div>
          )}
          {!invalidChain && !wrongWalletChain && (
            <div className="md:bg-gray-90 md:py-7 md:px-6 rounded">
              <StakesFrame delegationOnly />
              <VestingStakesFrame />
            </div>
          )}
        </NetworkBanner>
      </div>
    </>
  );
};

export default DelegationPage;
