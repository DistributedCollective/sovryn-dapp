import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { BOB_CHAIN_ID, RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkSwitch } from '../../2_molecules/NetworkSwitch/NetworkSwitch';
import { translations } from '../../../locales/i18n';
import AavePage from '../AavePage/AavePage';
import { LendFrame } from './components/LendFrame/LendFrame';

const LendPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.lendPage.meta.title)}</title>
    </Helmet>
    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mb-7">
      <NetworkSwitch
        components={{
          [RSK_CHAIN_ID]: (
            <>
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
            </>
          ),
          [BOB_CHAIN_ID]: <AavePage />,
        }}
      />
    </div>
  </>
);

export default LendPage;
