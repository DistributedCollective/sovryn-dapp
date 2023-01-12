import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { Icon, Heading, Badge, BadgeSize, HeadingType } from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import styles from './StatusItem.module.css';
import { StatusType } from './StatusItem.types';
import { getStatusClass, getStatusIcon } from './StatusItem.utils';

type StatusItemProps = {
  status: StatusType;
  content: ReactNode;
  label?: ReactNode;
  className?: string;
  dataAttribute?: string;
};

export const StatusItem: FC<StatusItemProps> = ({
  status = StatusType.idle,
  content,
  label,
  className,
  dataAttribute,
}) => (
  <div
    className={classNames(styles.statusItem, className)}
    {...applyDataAttr(dataAttribute)}
  >
    <Badge
      size={BadgeSize.md}
      content={
        status === StatusType.idle ? (
          content
        ) : (
          <Icon
            icon={`${getStatusIcon(status)}`}
            className={`${getStatusClass(status)}`}
            size={24}
          />
        )
      }
    />
    {label && (
      <Heading
        className={classNames({
          [styles.error]: status === StatusType.error,
        })}
        type={HeadingType.h2}
        children={label}
      />
    )}
  </div>
);
