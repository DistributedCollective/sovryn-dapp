import React, { createContext, useCallback, useContext, useState } from 'react';

import { NotificationItem, NotificationStack } from '@sovryn/ui';

interface NotificationContextInterface {
  notifications: NotificationItem[];
  addNotification: (notification: NotificationItem) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextInterface | null>(
  null,
);

export const useNotificationContext = () => {
  return useContext(NotificationContext) as NotificationContextInterface;
};

interface Props {
  children?: React.ReactNode;
}

export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback(
    (notification: NotificationItem) => {
      const prvNotifications = [...notifications];
      prvNotifications.push(notification);
      setNotifications(prvNotifications);
    },
    [notifications],
  );

  const removeNotification = useCallback(
    (id: number) => {
      const prvNotifications = [...notifications];
      setNotifications(
        prvNotifications.filter(notification => notification.id !== id),
      );
    },
    [notifications],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      <NotificationStack
        className="top-16"
        items={notifications}
        onClose={removeNotification}
      />
      {children}
    </NotificationContext.Provider>
  );
};
