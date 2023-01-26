import React from 'react';

import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';

import { applyDataAttr } from '../../utils';
import { Notification } from '../Notification/Notification';
import styles from './NotificationStack.module.css';
import { NotificationItem } from './NotificationStack.types';

type NotificationStackProps = {
  className?: string;
  dataAttribute?: string;
  onClose?: (id: number | string) => void;
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
    <AnimatePresence initial={false}>
      {items.map(
        ({
          className,
          dataAttribute,
          content,
          type,
          title,
          dismissible,
          id,
        }) => (
          <Notification
            key={id}
            className={classNames(className, {
              [styles.dismissible]: dismissible,
            })}
            dataAttribute={dataAttribute}
            onClose={dismissible ? () => onClose?.(id) : undefined}
            content={content}
            type={type}
            title={title}
          />
        ),
      )}
    </AnimatePresence>
  </div>
);
