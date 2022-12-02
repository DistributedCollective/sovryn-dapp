import React, { FC, useCallback, useState } from 'react';

import { Button, ButtonStyle, Checkbox } from '@sovryn/ui';

import { FilterType } from '../../TableFilter.types';
import styles from './Filter.module.css';

type FilterProps = {
  filterList: FilterType[];
  onClose: () => void;
  onChange: (filterList: FilterType[]) => void;
};

export const Filter: FC<FilterProps> = ({ filterList, onClose, onChange }) => {
  console.log('filterList:', filterList);
  const [filters, setFilters] = useState(
    filterList.map(item => !!item.checked),
  );

  const updateFilters = useCallback(
    (checked: boolean, index: number) => {
      const newFilters = [...filters];
      newFilters[index] = !!checked;
      setFilters(newFilters);
    },
    [filters],
  );

  return (
    <div className={styles.filter}>
      <div>
        {filterList.map((filterItem, index) => (
          <Checkbox
            key={filterItem.filter}
            label={filterItem.label}
            checked={!!filters[index]}
            onChange={e => updateFilters(e.target.checked, index)}
          />
        ))}
        <div className="w-full flex items-center justify-between mt-3">
          <Button
            style={ButtonStyle.secondary}
            text="Cancel"
            onClick={onClose}
          />
          <Button
            text="OK"
            onClick={() => {
              onChange(
                filterList.map((f, i) => ({
                  ...f,
                  checked: !!filters[i],
                })),
              );
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
