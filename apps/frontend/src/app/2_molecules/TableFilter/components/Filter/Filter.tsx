import React, { FC, useCallback, useState } from 'react';

import { Button, ButtonStyle, Checkbox } from '@sovryn/ui';

import { Filter as FilterType } from '../../TableFilter.types';
import styles from './Filter.module.css';

type FilterProps = {
  filterList: FilterType[];
  onClose: () => void;
  onChange: (filterList: FilterType[]) => void;
};

export const Filter: FC<FilterProps> = ({ filterList, onClose, onChange }) => {
  const [filters, setFilters] = useState(filterList.map(item => ({ ...item })));

  const updateFilters = useCallback(
    (checked: boolean, index: number) => {
      const newFilters = [...filters];
      newFilters[index].checked = !!checked;
      setFilters(newFilters);
    },
    [filters],
  );

  const onSubmit = useCallback(() => {
    onChange(filters);
    onClose();
  }, [filters, onChange, onClose]);

  return (
    <div className={styles.filter}>
      <div>
        {filters.map((filterItem, index) => (
          <Checkbox
            key={filterItem.filter}
            label={filterItem.label}
            checked={filterItem.checked}
            onChange={e => updateFilters(e.target.checked, index)}
          />
        ))}
        <div className="w-full flex items-center justify-between mt-3">
          <Button
            style={ButtonStyle.secondary}
            text="Cancel"
            onClick={onClose}
          />
          <Button text="OK" onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};
