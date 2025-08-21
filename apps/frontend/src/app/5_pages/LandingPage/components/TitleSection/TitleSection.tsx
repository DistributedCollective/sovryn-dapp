import React, { FC, RefObject, useCallback } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { scrollToElement } from '../../../../../utils/helpers';

const pageTranslations = translations.landingPage.titleSection;

type TitleSectionProps = {
  ctaRef: RefObject<HTMLDivElement>;
};

export const TitleSection: FC<TitleSectionProps> = ({ ctaRef }) => {
  const ctaClickHandler = useCallback(() => {
    scrollToElement(ctaRef);
  }, [ctaRef]);

  return (
    <div className="min-h-40">
      <div className="text-2xl font-medium leading-7 text-gray-10">
        {t(pageTranslations.title)}
      </div>
      <div className="text-sm font-medium mt-3 text-gray-30">
        {t(pageTranslations.description)}
      </div>
      <Trans
        i18nKey={t(pageTranslations.cta)}
        components={[
          <Button
            text={t(pageTranslations.ctaText)}
            onClick={ctaClickHandler}
            style={ButtonStyle.ghost}
          />,
        ]}
      />
    </div>
  );
};
