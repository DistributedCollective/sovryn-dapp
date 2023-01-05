import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

import { noop } from '@sovryn/ui';

import { Notification } from '../EmailNotificationSettingsDialog.types';

type EmailNotificationSettingsContextValue = {
  subscriptions: Notification[];
  setSubscriptions: Dispatch<SetStateAction<Notification[]>>;
  resetSubscriptions: () => void;
  marginCallsToggle: boolean;
  setMarginCallsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  liquidationsToggle: boolean;
  setLiquidationsToggle: React.Dispatch<React.SetStateAction<boolean>>;
  stabilityPoolToggle: boolean;
  setStabilityPoolToggle: React.Dispatch<React.SetStateAction<boolean>>;
  systemToggle: boolean;
  setSystemToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultContextValue: EmailNotificationSettingsContextValue = {
  subscriptions: [],
  setSubscriptions: noop,
  resetSubscriptions: noop,
  marginCallsToggle: false,
  setMarginCallsToggle: noop,
  liquidationsToggle: false,
  setLiquidationsToggle: noop,
  stabilityPoolToggle: false,
  setStabilityPoolToggle: noop,
  systemToggle: false,
  setSystemToggle: noop,
};

const EmailNotificationSettingsContext =
  createContext<EmailNotificationSettingsContextValue>(defaultContextValue);

export const useEmailNotificationSettingsContext = () =>
  useContext(EmailNotificationSettingsContext);

export const EmailNotificationSettingsContextProvider: React.FC<
  PropsWithChildren
> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState(
    defaultContextValue.subscriptions,
  );

  const [marginCallsToggle, setMarginCallsToggle] = useState(false);
  const [liquidationsToggle, setLiquidationsToggle] = useState(false);
  const [stabilityPoolToggle, setStabilityPoolToggle] = useState(false);
  const [systemToggle, setSystemToggle] = useState(false);

  const resetSubscriptions = useCallback(() => {
    setSubscriptions(defaultContextValue.subscriptions);
  }, []);

  return (
    <EmailNotificationSettingsContext.Provider
      value={{
        subscriptions,
        setSubscriptions,
        resetSubscriptions,
        marginCallsToggle,
        setMarginCallsToggle,
        liquidationsToggle,
        setLiquidationsToggle,
        stabilityPoolToggle,
        setStabilityPoolToggle,
        systemToggle,
        setSystemToggle,
      }}
    >
      {children}
    </EmailNotificationSettingsContext.Provider>
  );
};
