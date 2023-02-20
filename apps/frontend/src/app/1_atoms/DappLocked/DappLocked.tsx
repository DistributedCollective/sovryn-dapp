import React, { FC } from 'react';

import { t } from 'i18next';

import { SovrynLogo } from '../../2_molecules';
import sovrynLogo from '../../../assets/images/sovryn-small-logo.svg';
import { translations } from '../../../locales/i18n';

export const DappLocked: FC = () => (
  <div className="flex-grow bg-black flex items-center justify-center">
    <div className="sm:rounded sm:w-96 sm:px-14 sm:py-10 sm:bg-gray-90">
      <SovrynLogo
        image={sovrynLogo}
        className="w-8 mx-auto mb-5"
        dataAttribute="header-logo"
      />
      <p className="max-w-xs mx-auto text-center text-sm leading-4 mb-1">
        {t(translations.maintenanceMode.fullD2.title)}
        <br />
        <br />
        {t(translations.maintenanceMode.fullD2.description)}
      </p>
    </div>
  </div>
);
