import React, { FC } from 'react';

import { Trans } from 'react-i18next';

import { SovrynLogo } from '../../2_molecules';
import sovrynLogo from '../../../assets/images/sovryn-small-logo.svg';
import { translations } from '../../../locales/i18n';

export const DappLocked: FC = () => (
  <div className="flex-grow bg-black flex items-center justify-center">
    <div className="sm:rounded sm:w-[24rem] sm:px-14 sm:py-10 sm:bg-gray-90">
      <SovrynLogo
        image={sovrynLogo}
        className="w-8 mx-auto mb-5"
        dataAttribute="header-logo"
      />
      <p className="mb-0 max-w-[20rem] mx-auto text-center">
        <Trans i18nKey={translations.maintenanceMode.fullD2} />
      </p>
    </div>
  </div>
);
