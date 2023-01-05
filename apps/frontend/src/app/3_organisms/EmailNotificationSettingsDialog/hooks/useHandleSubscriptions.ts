import { useCallback, useState } from 'react';

import {
  AlertGroup,
  AlertGroupToNotificationsMapping,
  Notification,
  defaultSubscriptionsArray,
} from '../EmailNotificationSettingsDialog.types';
import { isSubscribedToGroup } from '../EmailNotificationSettingsDialog.utils';

export const useHandleSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(defaultSubscriptionsArray);

  const [marginCallsToggle, setMarginCallsToggle] = useState(false);
  const [liquidationsToggle, setLiquidationsToggle] = useState(false);
  const [stabilityPoolToggle, setStabilityPoolToggle] = useState(false);
  const [systemToggle, setSystemToggle] = useState(false);

  const resetSubscriptions = useCallback(() => {
    setSubscriptions(defaultSubscriptionsArray);
    setMarginCallsToggle(false);
    setLiquidationsToggle(false);
    setStabilityPoolToggle(false);
    setSystemToggle(false);
  }, []);

  const parseSubscriptionsResponse = useCallback(
    (subscriptions: Notification[]) => {
      const parsedSubscriptions: Notification[] = subscriptions.map(item => ({
        notification: item.notification,
        isSubscribed: item.isSubscribed,
      }));

      setSubscriptions(parsedSubscriptions);

      setMarginCallsToggle(
        isSubscribedToGroup(AlertGroup.MarginCalls, parsedSubscriptions),
      );
      setLiquidationsToggle(
        isSubscribedToGroup(AlertGroup.Liquidations, parsedSubscriptions),
      );
      setStabilityPoolToggle(
        isSubscribedToGroup(AlertGroup.StabilityPool, parsedSubscriptions),
      );
      setSystemToggle(
        isSubscribedToGroup(AlertGroup.System, parsedSubscriptions),
      );
    },
    [],
  );

  const updateSubscriptions = useCallback(
    (group: AlertGroup) => {
      const newSubscriptionsState = subscriptions.map(item => {
        if (
          AlertGroupToNotificationsMapping[group].includes(item.notification)
        ) {
          return {
            notification: item.notification,
            isSubscribed: !item.isSubscribed,
          };
        }

        return item;
      });

      setSubscriptions(newSubscriptionsState);
    },
    [subscriptions],
  );

  const marginCallsToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.MarginCalls);
    setMarginCallsToggle(prevValue => !prevValue);
  }, [updateSubscriptions]);

  const liquidationsToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.Liquidations);
    setLiquidationsToggle(prevValue => !prevValue);
  }, [updateSubscriptions]);

  const stabilityPoolToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.StabilityPool);
    setStabilityPoolToggle(prevValue => !prevValue);
  }, [updateSubscriptions]);

  const systemToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.System);
    setSystemToggle(prevValue => !prevValue);
  }, [updateSubscriptions]);

  return {
    subscriptions,
    marginCallsToggle,
    liquidationsToggle,
    stabilityPoolToggle,
    systemToggle,
    resetSubscriptions,
    parseSubscriptionsResponse,
    marginCallsToggleHandler,
    liquidationsToggleHandler,
    stabilityPoolToggleHandler,
    systemToggleHandler,
  };
};
