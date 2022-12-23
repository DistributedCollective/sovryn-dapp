import React, { ReactNode, useCallback } from 'react';

import { Dropdown, DropdownProps } from '../Dropdown';
import { Menu, MenuItem } from '../Menu';
import { SelectOption } from './Select.types';

export type SelectProps<T = string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  dataLayoutId?: string;
  dropdownProps?: Omit<
    DropdownProps,
    'text' | 'children' | 'dataLayoutId' | 'closeOnClick'
  >;
  labelRenderer?: (props: SelectProps<T>) => ReactNode;
  className?: string;
};

export const Select = <T extends string>({
  labelRenderer = DefaultLabelRenderer,
  ...props
}: SelectProps<T>) => {
  const { options, onChange, dropdownProps, dataLayoutId, className } = props;

  const handleOptionClick = useCallback(
    (option: SelectOption<T>) => () => onChange(option.value),
    [onChange],
  );

  return (
    <Dropdown
      text={labelRenderer(props)}
      dataLayoutId={dataLayoutId}
      closeOnClick
      className={className}
      {...dropdownProps}
    >
      <Menu>
        {options.map(option => (
          <MenuItem
            key={option.value.toString()}
            text={option.label}
            onClick={handleOptionClick(option)}
            dataLayoutId={`${dataLayoutId}__option-${option.value}`}
            isActive={option.value === props.value}
          />
        ))}
      </Menu>
    </Dropdown>
  );
};

const DefaultLabelRenderer = <T extends string>({
  value,
  options,
}: SelectProps<T>) => {
  return (
    <>
      {options.find(item => item.value === value)?.label || 'Select an option'}
    </>
  );
};
