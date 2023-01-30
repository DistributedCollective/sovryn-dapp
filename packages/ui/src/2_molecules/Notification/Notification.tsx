import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { Icon, IconNames, Paragraph, ParagraphSize } from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import styles from './Notification.module.css';
import { NotificationType } from './Notification.types';
import { getIcon } from './Notification.utils';

type NotificationProps = {
  className?: string;
  dataAttribute?: string;
  onClose?: () => void;
  content?: ReactNode;
  type?: NotificationType;
  title: string;
};

export const Notification: React.FC<NotificationProps> = ({
  className,
  dataAttribute,
  onClose,
  content,
  type = NotificationType.success,
  title,
}) => (
  <div
    {...applyDataAttr(dataAttribute)}
    className={classNames(styles.notification, styles[type], className)}
  >
    {onClose && (
      <button onClick={onClose} className={styles.close}>
        <Icon icon={IconNames.X_MARK} size={10} />
        <span>Close</span>
      </button>
    )}
    <div className={styles.title}>
      <Icon icon={getIcon(type)} size={18} />
      <Paragraph size={ParagraphSize.base}>{title}</Paragraph>
    </div>
    {content && <div className={styles.content}>{content}</div>}
  </div>
);
