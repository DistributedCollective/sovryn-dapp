import { useCallback } from 'react';

import {
  AlertGroup,
  AlertGroupToNotificationsMapping,
  defaultSubscriptionsArray,
  Notification,
} from '../EmailNotificationSettingsDialog.types';
import { isSubscribedToGroup } from '../EmailNotificationSettingsDialog.utils';
import { useEmailNotificationSettingsContext } from '../contexts/EmailNotificationSettingsContext';

export const useHandleSubscriptions = () => {
  const {
    subscriptions,
    setSubscriptions,
    resetSubscriptions: resetSubscriptionsState,
    setMarginCallsToggle,
    setLiquidationsToggle,
    setStabilityPoolToggle,
    setSystemToggle,
    setServerSubscriptionsState,
  } = useEmailNotificationSettingsContext();

  const resetSubscriptions = useCallback(() => {
    resetSubscriptionsState();
    setMarginCallsToggle(false);
    setLiquidationsToggle(false);
    setStabilityPoolToggle(false);
    setSystemToggle(false);
  }, [
    resetSubscriptionsState,
    setMarginCallsToggle,
    setLiquidationsToggle,
    setStabilityPoolToggle,
    setSystemToggle,
  ]);

  const parseSubscriptionsResponse = useCallback(
    (subscriptions: Notification[]) => {
      const parsedSubscriptions: Notification[] = subscriptions.map(item => ({
        notification: item.notification,
        isSubscribed: item.isSubscribed,
      }));

      setSubscriptions(parsedSubscriptions);
      setServerSubscriptionsState(parsedSubscriptions);

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
    [
      setSubscriptions,
      setMarginCallsToggle,
      setLiquidationsToggle,
      setStabilityPoolToggle,
      setSystemToggle,
      setServerSubscriptionsState,
    ],
  );

  const updateSubscriptions = useCallback(
    (group: AlertGroup) => {
      const oldSubscriptionsState =
        subscriptions.length > 0 ? subscriptions : defaultSubscriptionsArray;

      const newSubscriptionsState = oldSubscriptionsState.map(item => {
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
    [subscriptions, setSubscriptions],
  );

  const marginCallsToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.MarginCalls);
    setMarginCallsToggle(prevValue => !prevValue);
  }, [updateSubscriptions, setMarginCallsToggle]);

  const liquidationsToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.Liquidations);
    setLiquidationsToggle(prevValue => !prevValue);
  }, [updateSubscriptions, setLiquidationsToggle]);

  const stabilityPoolToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.StabilityPool);
    setStabilityPoolToggle(prevValue => !prevValue);
  }, [updateSubscriptions, setStabilityPoolToggle]);

  const systemToggleHandler = useCallback(() => {
    updateSubscriptions(AlertGroup.System);
    setSystemToggle(prevValue => !prevValue);
  }, [updateSubscriptions, setSystemToggle]);

  return {
    resetSubscriptions,
    parseSubscriptionsResponse,
    marginCallsToggleHandler,
    liquidationsToggleHandler,
    stabilityPoolToggleHandler,
    systemToggleHandler,
  };
};
