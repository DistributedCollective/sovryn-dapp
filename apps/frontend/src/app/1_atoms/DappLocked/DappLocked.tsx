import React, { FC } from 'react';

import { t } from 'i18next';

import { SovrynLogo } from '../../2_molecules';
import { NetworkPicker } from '../../2_molecules/NetworkPicker/NetworkPicker';
import sovrynLogo from '../../../assets/images/sovryn-small-logo.svg';
import { translations } from '../../../locales/i18n';

export const DappLocked: FC = () => (
  <div className="flex-grow bg-black flex flex-col">
    <div className="w-full flex justify-start p-4">
      <NetworkPicker className="mr-6" />
    </div>

    <div className="flex-grow flex items-center justify-center">
      <div className="sm:rounded sm:w-96 sm:px-14 sm:py-10 sm:bg-gray-90">
        <SovrynLogo
          image={sovrynLogo}
          className="w-8 mx-auto mb-5"
          dataAttribute="header-logo"
        />
        <div className="max-w-xs mx-auto text-center text-sm leading-4 mb-1">
          <div className="mb-6">
            {t(translations.maintenanceMode.fullD2.title)}
          </div>
          {t(translations.maintenanceMode.fullD2.description)}
        </div>
      </div>
    </div>
  </div>
);
