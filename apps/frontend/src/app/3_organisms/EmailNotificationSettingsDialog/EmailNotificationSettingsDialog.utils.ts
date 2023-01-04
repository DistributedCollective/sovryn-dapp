import {
  Notification,
  AlertGroup,
  GroupsToNotificationsMapping,
} from './EmailNotificationSettingsDialog.types';

export const isSubscribedToGroup = (
  group: AlertGroup,
  states: Notification[],
) => {
  const groupSubscriptions = states
    .map(item =>
      GroupsToNotificationsMapping[group].includes(item.notification)
        ? item
        : null,
    )
    .filter(item => item);

  return groupSubscriptions.every(item => item?.isSubscribed);
};
