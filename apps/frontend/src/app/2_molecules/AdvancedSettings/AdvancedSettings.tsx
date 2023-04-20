import React, { FC, useMemo, useReducer } from 'react';

import { t } from 'i18next';

import { Accordion, AmountInput, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

type AdvancedSettingsProps = {
  amount: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  className?: string;
  errorMessage?: string;
};

export const AdvancedSettings: FC<AdvancedSettingsProps> = ({
  amount,
  onChange,
  className,
  invalid,
  errorMessage,
}) => {
  const [open, toggle] = useReducer(v => !v, false);

  const errorBadge = useMemo(() => {
    if (!invalid || !errorMessage) {
      return null;
    }

    return <ErrorBadge level={ErrorLevel.Critical} message={errorMessage} />;
  }, [invalid, errorMessage]);

  return (
    <Accordion
      open={open}
      label={t(translations.advancedSettings.label)}
      onClick={toggle}
      className={className}
      children={
        <>
          <AmountInput
            label={t(translations.advancedSettings.inputLabel)}
            value={amount}
            onChangeText={onChange}
            invalid={invalid}
            unit="%"
            className="max-w-full"
            dataAttribute="advanced-settings-input"
            decimalPrecision={2}
          />
          {errorBadge}
        </>
      }
      dataAttribute="advanced-settings-accordion"
    />
  );
};
