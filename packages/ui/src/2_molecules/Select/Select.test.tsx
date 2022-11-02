import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { FC, ReactNode, useCallback } from 'react';

import { Select, SelectProps } from './Select';
import { SelectOption } from './Select.types';

const options: SelectOption[] = [
  {
    value: '1',
    label: 'Option 1',
  },
  {
    value: '2',
    label: 'Option 2',
  },
  {
    value: '3',
    label: 'Option 3',
  },
];

type ComponentProps = {
  onChange?: (value: string) => void;
  labelRenderer?: (props: SelectProps) => ReactNode;
};

const Component: FC<ComponentProps> = ({ onChange, labelRenderer }) => {
  const [value, setValue] = React.useState(options[0].value);
  const handleChange = useCallback(
    value => {
      setValue(value);
      onChange?.(value);
    },
    [onChange],
  );
  return (
    <Select
      value={value}
      options={options}
      onChange={handleChange}
      labelRenderer={labelRenderer}
    />
  );
};

describe('Select', () => {
  it('renders preselected label', () => {
    const { getByText } = render(<Component />);
    expect(getByText(options[0].label)).toBeInTheDocument();
  });

  it('does not show list of options when dropdown is not open', () => {
    const { getByText } = render(<Component />);
    options
      .filter((item, index) => index !== 0)
      .forEach(option => {
        expect(() => getByText(option.label)).toThrowError();
      });
  });

  it('does show list of options when dropdown is open', () => {
    const { getByText } = render(<Component />);

    userEvent.click(getByText(options[0].label));

    options
      .filter((item, index) => index !== 0)
      .forEach(option => {
        expect(getByText(option.label)).toBeInTheDocument();
      });
  });

  it('changes label when option selected', () => {
    const { getByText } = render(<Component />);

    userEvent.click(getByText(options[0].label));

    userEvent.click(getByText(options[1].label));

    expect(getByText(options[1].label)).toBeInTheDocument();

    options
      .filter((item, index) => index !== 1)
      .forEach(option => {
        expect(() => getByText(option.label)).toThrowError();
      });
  });

  it('uses custom label renderer', () => {
    const { getByText } = render(
      <Component labelRenderer={({ value }) => <>selected: #{value}</>} />,
    );
    expect(getByText('selected: #1')).toBeInTheDocument();
  });
});
