import React, { useEffect } from 'react';

import { Notification } from '../../../Notification/Notification';
import { NotificationItem } from '../../NotificationStack.types';

export const NotificationStackItem: React.FC<NotificationItem> = ({
  className,
  dataAttribute,
  content,
  type,
  title,
  dismissible,
  id,
  onClose,
  timeout,
}) => {
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => onClose?.(id), timeout);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Notification
      key={id}
      className={className}
      dataAttribute={dataAttribute}
      onClose={dismissible ? () => onClose?.(id) : undefined}
      content={content}
      type={type}
      title={title}
    />
  );
};
