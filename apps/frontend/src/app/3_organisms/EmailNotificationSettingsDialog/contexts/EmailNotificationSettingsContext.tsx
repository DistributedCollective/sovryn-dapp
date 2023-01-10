import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { noop } from '@sovryn/ui';

import { Notification } from '../EmailNotificationSettingsDialog.types';

type EmailNotificationSettingsContextValue = {
  setServerSubscriptionsState: Dispatch<SetStateAction<Notification[]>>;
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
  haveSubscriptionsBeenUpdated: boolean;
};

const defaultContextValue: EmailNotificationSettingsContextValue = {
  setServerSubscriptionsState: noop,
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
  haveSubscriptionsBeenUpdated: false,
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

  const [serverSubscriptionsState, setServerSubscriptionsState] = useState(
    defaultContextValue.subscriptions,
  );

  const [haveSubscriptionsBeenUpdated, setHaveSubscriptionsBeenUpdated] =
    useState(defaultContextValue.haveSubscriptionsBeenUpdated);

  const [marginCallsToggle, setMarginCallsToggle] = useState(false);
  const [liquidationsToggle, setLiquidationsToggle] = useState(false);
  const [stabilityPoolToggle, setStabilityPoolToggle] = useState(false);
  const [systemToggle, setSystemToggle] = useState(false);

  const resetSubscriptions = useCallback(() => {
    setSubscriptions(defaultContextValue.subscriptions);
  }, []);

  useEffect(() => {
    // New users or previously registered users without any subscriptions
    if (subscriptions.length > 0 && serverSubscriptionsState.length === 0) {
      const isSubscribedToSomething = subscriptions.some(
        item => item.isSubscribed,
      );

      if (isSubscribedToSomething) {
        setHaveSubscriptionsBeenUpdated(true);
      } else if (!isSubscribedToSomething && haveSubscriptionsBeenUpdated) {
        setHaveSubscriptionsBeenUpdated(false);
      }
    }

    // Regular users with existing subscriptions
    if (subscriptions.length > 0 && serverSubscriptionsState.length > 0) {
      const haveSubscriptionsBeenUpdated = subscriptions.some(
        item =>
          item.isSubscribed !==
          serverSubscriptionsState.find(
            serverItem => serverItem.notification === item.notification,
          )!.isSubscribed,
      );

      setHaveSubscriptionsBeenUpdated(haveSubscriptionsBeenUpdated);
    }
  }, [subscriptions, serverSubscriptionsState, haveSubscriptionsBeenUpdated]);

  return (
    <EmailNotificationSettingsContext.Provider
      value={{
        setServerSubscriptionsState,
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
        haveSubscriptionsBeenUpdated,
      }}
    >
      {children}
    </EmailNotificationSettingsContext.Provider>
  );
};
