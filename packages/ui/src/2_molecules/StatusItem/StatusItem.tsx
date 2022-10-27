import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { Icon, Heading, Badge, BadgeSize, HeadingType } from '../../1_atoms';
import styles from './StatusItem.module.css';
import { StatusEnum } from './StatusItem.types';
import { getStatusClass, getStatusIcon } from './StatusItem.utils';

type StatusItemProps = {
  status: StatusEnum;
  content: ReactNode;
  label?: ReactNode;
  className?: string;
  dataLayoutId?: string;
};

export const StatusItem: FC<StatusItemProps> = ({
  status = StatusEnum.idle,
  content,
  label,
  className,
  dataLayoutId,
}) => (
  <div
    className={classNames(styles.statusItem, className)}
    data-layout-id={dataLayoutId}
  >
    <Badge
      size={BadgeSize.md}
      content={
        status === StatusEnum.idle ? (
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
          [styles.error]: status === StatusEnum.error,
        })}
        type={HeadingType.h2}
        children={label}
      />
    )}
  </div>
);
