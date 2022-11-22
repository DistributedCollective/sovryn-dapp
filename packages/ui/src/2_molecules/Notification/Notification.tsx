import React, { ReactNode, useCallback } from 'react';

import classNames from 'classnames';

import {
  Button,
  ButtonStyle,
  Icon,
  IconNames,
  Paragraph,
  ParagraphSize,
} from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import styles from './Notification.module.css';
import { NotificationType } from './Notification.types';
import { getIcon } from './Notification.utils';

type NotificationProps = {
  className?: string;
  dataAttribute?: string;
  onClick?: () => void;
  onClose?: () => void;
  content?: ReactNode;
  type?: NotificationType;
  title: string;
  buttonLabel?: string;
};

export const Notification: React.FC<NotificationProps> = ({
  className,
  dataAttribute,
  onClick,
  onClose,
  content,
  type = NotificationType.success,
  title,
  buttonLabel,
}) => {
  const handleClick = useCallback(() => {
    onClick?.();
    onClose?.();
  }, [onClick, onClose]);

  return (
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
      <div>
        <Icon icon={getIcon(type)} size={18} />
        <Paragraph className={styles.title} size={ParagraphSize.base}>
          {title}
        </Paragraph>
      </div>
      {content && <div className={styles.content}>{content}</div>}
      {buttonLabel && (
        <Button
          className={styles.button}
          style={ButtonStyle.secondary}
          text={buttonLabel}
          onClick={handleClick}
        />
      )}
    </div>
  );
};
