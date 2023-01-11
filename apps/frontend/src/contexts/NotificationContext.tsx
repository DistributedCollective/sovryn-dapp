import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { NotificationItem, NotificationStack } from '@sovryn/ui';

import { DEFAULT_TIMEOUT_SECONDS } from '../utils/constants';

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

interface NotificationProviderProps {
  children?: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [time, setTime] = useState(Date.now());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const addNotification = useCallback(
    (notification: NotificationItem, timeout = DEFAULT_TIMEOUT_SECONDS) => {
      if (notifications.find(item => item.id === notification.id)) {
        return;
      }
      const prvNotifications = [...notifications];
      prvNotifications.unshift({
        ...notification,
        timestamp: Date.now(),
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
