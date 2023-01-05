import React from 'react';

import { useTranslation } from 'react-i18next';

import { Toggle } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';

type SubscriptionsProps = {
  marginCallsToggle: boolean;
  liquidationsToggle: boolean;
  stabilityPoolToggle: boolean;
  systemToggle: boolean;
  marginCallsToggleHandler: () => void;
  liquidationsToggleHandler: () => void;
  stabilityPoolToggleHandler: () => void;
  systemToggleHandler: () => void;
};

export const Subscriptions: React.FC<SubscriptionsProps> = ({
  marginCallsToggle,
  liquidationsToggle,
  stabilityPoolToggle,
  systemToggle,
  marginCallsToggleHandler,
  liquidationsToggleHandler,
  stabilityPoolToggleHandler,
  systemToggleHandler,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-80 rounded p-4">
      <Toggle
        checked={marginCallsToggle}
        onChange={marginCallsToggleHandler}
        label={t(
          translations.emailNotificationsDialog.alertGroups.marginCallsToggle,
        )}
      />

      <Toggle
        checked={liquidationsToggle}
        onChange={liquidationsToggleHandler}
        label={t(
          translations.emailNotificationsDialog.alertGroups.liquidationsToggle,
        )}
      />

      <Toggle
        checked={stabilityPoolToggle}
        onChange={stabilityPoolToggleHandler}
        label={t(
          translations.emailNotificationsDialog.alertGroups.stabilityPoolToggle,
        )}
      />

      <Toggle
        checked={systemToggle}
        onChange={systemToggleHandler}
        label={t(
          translations.emailNotificationsDialog.alertGroups.systemToggle,
        )}
      />
    </div>
  );
};
