import React from 'react';

import { useTranslation } from 'react-i18next';

import { Toggle } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';
import { useEmailNotificationSettingsContext } from '../contexts/EmailNotificationSettingsContext';
import { useHandleSubscriptions } from '../hooks/useHandleSubscriptions';

export const Subscriptions: React.FC = () => {
  const { t } = useTranslation();

  const {
    marginCallsToggle,
    liquidationsToggle,
    stabilityPoolToggle,
    systemToggle,
  } = useEmailNotificationSettingsContext();

  const {
    marginCallsToggleHandler,
    liquidationsToggleHandler,
    stabilityPoolToggleHandler,
    systemToggleHandler,
  } = useHandleSubscriptions();

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
