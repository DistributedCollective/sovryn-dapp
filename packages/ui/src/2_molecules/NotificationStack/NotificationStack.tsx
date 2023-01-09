import React from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './NotificationStack.module.css';
import { NotificationItem } from './NotificationStack.types';
import { NotificationStackItem } from './components/NotificationStackItem/NotificationStackItem';

type NotificationStackProps = {
  className?: string;
  dataAttribute?: string;
  onClose?: (id: number) => void;
  items: NotificationItem[];
};

export const NotificationStack: React.FC<NotificationStackProps> = ({
  className,
  dataAttribute,
  onClose,
  items,
}) => (
  <div
    {...applyDataAttr(dataAttribute)}
    className={classNames(styles.NotificationStack, className)}
  >
    {items.map(
      ({
        className,
        dataAttribute,
        content,
        type,
        title,
        dismissible,
        id,
        timeout,
      }) => (
        <NotificationStackItem
          key={id}
          className={className}
          dataAttribute={dataAttribute}
          onClose={onClose}
          content={content}
          type={type}
          title={title}
          timeout={timeout}
          id={id}
          dismissible={dismissible}
        />
      ),
    )}
  </div>
);
