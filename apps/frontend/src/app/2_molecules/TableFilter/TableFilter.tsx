import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';

import { Icon, IconNames, useOnClickOutside } from '@sovryn/ui';

import styles from './TableFilter.module.css';
import { Filter as FilterType } from './TableFilter.types';
import { Filter } from './components/Filter/Filter';

type TableFilterProps = {
  filterList: FilterType[];
  onChange: (filterList: FilterType[]) => void;
};

export const TableFilter: FC<TableFilterProps> = ({ filterList, onChange }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(false);

  useOnClickOutside([buttonRef, filterRef], () => setShow(false));

  const isActive = useMemo(
    () => show || filterList.some(f => f.checked === true),
    [show, filterList],
  );

  const toggleFilters = useCallback(() => setShow(!show), [show]);

  const onClose = useCallback(() => setShow(false), []);

  return (
    <div ref={filterRef} className={styles.wrapper}>
      <button
        onClick={toggleFilters}
        className={classNames(styles.button, {
          [styles.active]: isActive,
        })}
        ref={buttonRef}
      >
        <Icon icon={IconNames.FUNNEL} size={12} viewBox="0 0 12 8" />
      </button>
      {show && (
        <Filter filterList={filterList} onClose={onClose} onChange={onChange} />
      )}
    </div>
  );
};
