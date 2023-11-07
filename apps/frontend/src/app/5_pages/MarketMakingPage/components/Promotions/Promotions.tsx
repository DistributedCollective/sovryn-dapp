import React, { FC } from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize, Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

export const Promotions: FC = () => (
  <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded">
    <Paragraph className="mb-1 text-gray-30" size={ParagraphSize.base}>
      {t(translations.marketMakingPage.promotions.p1)}
    </Paragraph>
    <Paragraph className="mb-6 text-gray-30" size={ParagraphSize.base}>
      {t(translations.marketMakingPage.promotions.p2)}
      <Button
        text={t(translations.stakePage.stakingRewards.learnMoreLink)}
        href={''}
        className="ml-1"
        style={ButtonStyle.ghost}
        hrefExternal
      />
    </Paragraph>

    <div className="flex items-center gap-6 overflow-auto">
      <div className="bg-gray-80 min-w-64 rounded h-36" />
      <div className="bg-gray-80 min-w-64 rounded h-36" />
      <div className="bg-gray-80 min-w-64 rounded h-36" />
      <div className="bg-gray-80 min-w-64 rounded h-36" />
      <div className="bg-gray-80 min-w-64 rounded h-36" />
    </div>
  </div>
);
