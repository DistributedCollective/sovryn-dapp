import React, { FC, RefObject, useCallback } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { scrollToElement } from '../../../../../utils/helpers';

const baseTranslation = translations.leaderboardPage;

type IntroProps = {
  pointsSectionRef: RefObject<HTMLDivElement>;
};

export const Intro: FC<IntroProps> = ({ pointsSectionRef }) => {
  const primaryCtaClickHandler = useCallback(() => {
    scrollToElement(pointsSectionRef);
  }, [pointsSectionRef]);

  return (
    <div className="w-full md:w-[26rem] text-center">
      <div className="text-2xl font-medium mt-4 lg:mt-9">
        {t(baseTranslation.title)}
      </div>
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
          onClick={primaryCtaClickHandler}
        />
        <Button
          text={t(baseTranslation.secondaryCta)}
          style={ButtonStyle.ghost}
          hrefExternal
          href="https://sovryn.com/powa"
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
};
