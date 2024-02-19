import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

const baseTranslation = translations.leaderboardPage;

export const Intro: FC = () => (
  <div className="w-full md:w-[26rem] text-center">
    <div className="text-2xl font-medium mt-9">{t(baseTranslation.title)}</div>
    <div className="text-sm font-semibold mt-4">
      {t(baseTranslation.subtitle)}
    </div>
    <div className="text-sm font-medium mt-6">
      {t(baseTranslation.description)}
    </div>

    <div className="mt-4">
      <Button
        text={t(baseTranslation.primaryCta)}
        style={ButtonStyle.secondary}
        className="mr-4"
      />
      <Button
        text={t(baseTranslation.secondaryCta)}
        style={ButtonStyle.ghost}
      />
    </div>

    <div className="mt-11">
      <div className="text-2xl font-medium mt-9">
        {t(baseTranslation.ctaLinksSection.title)}
      </div>
      <div className="text-sm font-semibold mt-4">
        {t(baseTranslation.ctaLinksSection.subtitle)}
      </div>
    </div>
  </div>
);
