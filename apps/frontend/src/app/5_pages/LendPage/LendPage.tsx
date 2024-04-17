import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { translations } from '../../../locales/i18n';
import { LendFrame } from './components/LendFrame/LendFrame';

const LendPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.lendPage.meta.title)}</title>
    </Helmet>
    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mb-7">
      <NetworkBanner requiredChainId={RSK_CHAIN_ID}>
        <Heading className="text-center mb-3 lg:text-2xl">
          {t(translations.lendPage.title)}
        </Heading>

        <Paragraph
          className="text-center mb-6 lg:mb-10"
          size={ParagraphSize.base}
        >
          {t(translations.lendPage.subtitle)}
        </Paragraph>

        <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-6">
          <LendFrame />
        </div>
      </NetworkBanner>
    </div>
  </>
);

export default LendPage;
