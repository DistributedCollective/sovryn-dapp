import React, { FC, PropsWithChildren, useState } from 'react';

import classNames from 'classnames';

import { Icon, IconNames } from '../../../../1_atoms';
import styles from './Filter.module.css';

type FilterProps = {};

export const Filter: FC<PropsWithChildren<FilterProps>> = ({ children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => setShow(!show)}
        className={classNames(styles.button, {
          [styles.active]: show,
        })}
      >
        <Icon icon={IconNames.FUNNEL} size={12} viewBox="0 0 12 8" />
      </button>
      {show && <div className={styles.filter}>{children}</div>}
    </div>
  );
};
