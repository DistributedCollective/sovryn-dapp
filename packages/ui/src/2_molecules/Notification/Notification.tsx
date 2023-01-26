import React, { ReactNode } from 'react';

import classNames from 'classnames';
import { motion } from 'framer-motion';

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
  <motion.div
    layout
    initial={{ opacity: 0, y: 50, scale: 0.3 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
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
      <Paragraph className={styles.title} size={ParagraphSize.base}>
        {title}
      </Paragraph>
    </div>
    {content && <div className={styles.content}>{content}</div>}
  </motion.div>
);
