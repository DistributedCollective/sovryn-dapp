import { Network, SatsWagmiConfig } from '@gobob/sats-wagmi';

import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { queryClient } from '../../../lib/query-client';
import { translations } from '../../../locales/i18n';
import { BobGatewayForm } from './components/BobGatewayForm/BobGatewayForm';
import { BobGatewayOrders } from './components/BobGatewayOrders/BobGatewayOrders';

const BobGateway: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.bobGatewayPage.meta.title)}</title>
    </Helmet>

    <div className="px-0 container md:mx-9 mx-0">
      <Heading className="text-center mb-4 lg:text-2xl">
        {t(translations.bobGatewayPage.meta.title)}
      </Heading>

      <Paragraph
        className="text-center mb-6 lg:mb-10"
        size={ParagraphSize.base}
      >
        {t(translations.bobGatewayPage.description)}
      </Paragraph>

      <SatsWagmiConfig network={Network.mainnet} queryClient={queryClient}>
        <div className="px-0 md:mx-9 mx-0 md:mb-2 mb-7">
          <BobGatewayForm />
          <BobGatewayOrders />
        </div>
      </SatsWagmiConfig>
    </div>
  </>
);
export default BobGateway;
