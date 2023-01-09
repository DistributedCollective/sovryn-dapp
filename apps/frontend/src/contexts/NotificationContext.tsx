import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { NotificationItem, NotificationStack } from '@sovryn/ui';

interface Notification extends NotificationItem {
  timeout?: number;
  timestamp: number;
}

interface NotificationContextInterface {
  addNotification: (notification: NotificationItem, timeout?: number) => void;
  removeNotification: (id: number | string) => void;
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
  const [time, setTime] = useState(new Date().getTime());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const addNotification = useCallback(
    (notification: NotificationItem, timeout = 5000) => {
      if (notifications.find(item => item.id === notification.id)) {
        return;
      }
      const prvNotifications = [...notifications];
      prvNotifications.unshift({
        ...notification,
        timestamp: new Date().getTime(),
        timeout,
      });
      setNotifications(prvNotifications);
    },
    [notifications],
  );

  const removeNotification = useCallback(
    (id: number | string) => {
      const prvNotifications = [...notifications];
      setNotifications(
        prvNotifications.filter(notification => notification.id !== id),
      );
    },
    [notifications],
  );

  const notificationList = useMemo(() => {
    return notifications.filter(
      notification =>
        !notification.timeout ||
        notification.timestamp + notification.timeout > time,
    );
  }, [notifications, time]);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
      }}
    >
      <NotificationStack
        className="top-16"
        items={notificationList}
        onClose={removeNotification}
      />
      {children}
    </NotificationContext.Provider>
  );
};
