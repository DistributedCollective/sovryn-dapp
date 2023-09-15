import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Toggle, ToggleAlignment } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';
import { useEmailNotificationSettingsContext } from '../contexts/EmailNotificationSettingsContext';
import { useHandleSubscriptions } from '../hooks/useHandleSubscriptions';

const baseTranslationPath = translations.emailNotificationsDialog.alertGroups;

type ToggleItem = {
  checked: boolean;
  onChange: () => void;
  label: string;
  dataAttributeSuffix: string;
  className?: string;
};

type SubscriptionsProps = {
  isDisabled?: boolean;
  dataAttribute?: string;
};

export const Subscriptions: FC<SubscriptionsProps> = ({
  isDisabled,
  dataAttribute,
}) => {
  const {
    marginCallsToggle,
    liquidationsToggle,
    stabilityPoolToggle,
    systemToggle,
    bitocracyToggle,
  } = useEmailNotificationSettingsContext();

  const {
    marginCallsToggleHandler,
    liquidationsToggleHandler,
    stabilityPoolToggleHandler,
    systemToggleHandler,
    bitocracyToggleHandler,
  } = useHandleSubscriptions();

  const items: ToggleItem[] = useMemo(
    () => [
      {
        checked: marginCallsToggle,
        onChange: marginCallsToggleHandler,
        label: t(baseTranslationPath.marginCallsToggle),
        dataAttributeSuffix: 'margincalls',
        className: 'mb-7',
      },
      {
        checked: liquidationsToggle,
        onChange: liquidationsToggleHandler,
        label: t(baseTranslationPath.liquidationsToggle),
        dataAttributeSuffix: 'liquidations',
        className: 'mb-7',
      },
      {
        checked: stabilityPoolToggle,
        onChange: stabilityPoolToggleHandler,
        label: t(baseTranslationPath.stabilityPoolToggle),
        dataAttributeSuffix: 'stability',
        className: 'mb-7',
      },
      {
        checked: bitocracyToggle,
        onChange: bitocracyToggleHandler,
        label: t(baseTranslationPath.bitocracyToggle),
        dataAttributeSuffix: 'bitocracy',
        className: 'mb-7',
      },
      {
        checked: systemToggle,
        onChange: systemToggleHandler,
        label: t(baseTranslationPath.systemToggle),
        dataAttributeSuffix: 'system',
      },
    ],
    [
      liquidationsToggle,
      liquidationsToggleHandler,
      marginCallsToggle,
      marginCallsToggleHandler,
      stabilityPoolToggle,
      stabilityPoolToggleHandler,
      systemToggle,
      systemToggleHandler,
      bitocracyToggle,
      bitocracyToggleHandler,
    ],
  );

  return (
    <div className="bg-gray-80 rounded p-4">
      {items.map(item => (
        <Toggle
          key={item.dataAttributeSuffix}
          checked={item.checked}
          onChange={item.onChange}
          label={item.label}
          className={item.className}
          alignment={ToggleAlignment.LEFT}
          dataAttribute={`${dataAttribute}-${item.dataAttributeSuffix}`}
          disabled={isDisabled}
        />
      ))}
    </div>
  );
};
