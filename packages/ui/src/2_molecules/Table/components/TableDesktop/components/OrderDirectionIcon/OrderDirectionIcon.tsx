import React, { FC, useMemo } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '../../../../../../1_atoms';
import { OrderDirection } from '../../../../Table.types';
import styles from './OrderDirectionIcon.module.css';

type OrderDirectionIconProps = {
  orderBy?: string;
  id?: string;
  orderDirection?: OrderDirection;
  className?: string;
};

export const OrderDirectionIcon: FC<OrderDirectionIconProps> = ({
  orderBy,
  id,
  orderDirection,
  className,
}) => {
  const isAscending = useMemo(
    () => orderDirection === OrderDirection.Asc || orderBy !== id,
    [orderDirection, id, orderBy],
  );

  return (
    <Icon
      icon={IconNames.ARROW_RIGHT}
      className={classNames(styles.icon, className, {
        [styles.active]: orderBy === id,
        [styles.up]: isAscending,
        [styles.down]: !isAscending,
      })}
      size={12}
    />
  );
};
