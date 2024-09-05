import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { BOB_CHAIN_ID, RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkSwitch } from '../../2_molecules/NetworkSwitch/NetworkSwitch';
import { translations } from '../../../locales/i18n';
import AavePage from '../AavePage/AavePage';
import { BorrowFrame } from './components/BorrowFrame/BorrrowFrame';

const BorrowPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>{t(translations.fixedInterestPage.meta.title)}</title>
      </Helmet>

      <div className="px-0 container md:mx-9 mx-0 md:mb-2 mb-7">
        <NetworkSwitch
          components={{
            [RSK_CHAIN_ID]: (
              <>
                <Heading className="text-center mb-3 lg:text-2xl">
                  {t(translations.fixedInterestPage.title)}
                </Heading>

                <Paragraph
                  className="text-center mb-6 lg:mb-10"
                  size={ParagraphSize.base}
                >
                  {t(translations.fixedInterestPage.subtitle)}
                </Paragraph>

                <div className="w-full">
                  <BorrowFrame />
                </div>
              </>
            ),
            [BOB_CHAIN_ID]: <AavePage />,
          }}
        />
      </div>
    </>
  );
};
export default BorrowPage;
