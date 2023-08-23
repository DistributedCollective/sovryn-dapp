import { useCallback } from 'react';

import {
  AlertGroup,
  AlertGroupToNotificationsMapping,
  defaultSubscriptionsArray,
  Notification,
  NotificationMessageType,
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

  const withDefaultSubscriptions = useCallback(
    (subscriptions: Notification[]) =>
      defaultSubscriptionsArray.map(
        item =>
          subscriptions.find(
            subscription => subscription.notification === item.notification,
          ) ?? item,
      ),
    [],
  );

  const parseSubscriptionsResponse = useCallback(
    (subscriptions: Notification[]) => {
      const parsedSubscriptions: Notification[] = withDefaultSubscriptions(
        subscriptions,
      )
        .filter(item =>
          Object.values(NotificationMessageType).includes(item.notification),
        )
        .map(item => ({
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
      withDefaultSubscriptions,
      setSubscriptions,
      setServerSubscriptionsState,
      setMarginCallsToggle,
      setLiquidationsToggle,
      setStabilityPoolToggle,
      setSystemToggle,
    ],
  );

  const updateSubscriptions = useCallback(
    (group: AlertGroup) => {
      let oldSubscriptionsState =
        subscriptions.length === 0
          ? defaultSubscriptionsArray
          : defaultSubscriptionsArray.map(
              item =>
                subscriptions.find(
                  subscription =>
                    subscription.notification === item.notification,
                ) ?? item,
            );

      // fixes bug which caused group to always be disabled,
      // when new subscription type is added to the group and it's not subscribed to
      const checked = oldSubscriptionsState
        .filter(item =>
          AlertGroupToNotificationsMapping[group].includes(item.notification),
        )
        .some(item => !item.isSubscribed);

      const newSubscriptionsState = oldSubscriptionsState.map(item => {
        if (
          AlertGroupToNotificationsMapping[group].includes(item.notification)
        ) {
          return {
            notification: item.notification,
            isSubscribed: checked,
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
