import React, { FC, RefObject, useCallback } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { POWA_LINK } from '../../../../../constants/links';
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
        <Trans i18nKey={t(baseTranslation.subtitle)} />
      </div>
      <div className="text-sm font-medium mt-6">
        <Trans
          i18nKey={t(baseTranslation.description1)}
          components={[<span className="font-bold">Bitcoin OS</span>]}
        />
      </div>
      <div className="text-sm font-medium mt-4">
        {t(baseTranslation.description2)}
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
          href={POWA_LINK}
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
