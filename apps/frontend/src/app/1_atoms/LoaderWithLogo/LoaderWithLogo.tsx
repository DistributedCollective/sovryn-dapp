import React, { FC } from 'react';

import { t } from 'i18next';

import { ReactComponent as LogoSVG } from '../../../assets/images/sovryn-small-logo.svg';
import { translations } from '../../../locales/i18n';

type LoaderWithLogoProps = {
  text?: React.ReactNode;
};

export const LoaderWithLogo: FC<LoaderWithLogoProps> = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center flex-grow">
      <LogoSVG className="sv-logo" />
      <div className="sv-loading-text">
        {text ? text : t(translations.loader.loading)}
      </div>
    </div>
  );
};
