import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import React, {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Checkbox } from './Checkbox';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
};

const Template: Story<ComponentProps<typeof Checkbox>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (checked: boolean) => updateArgs({ checked }),
    [updateArgs],
  );
  return <Checkbox {...args} onChangeValue={handleOnChange} />;
};

const ids = [
  'lorem',
  'ipsum',
  'neque',
  'porro',
  'quisquam',
  'est',
  'qui',
  'dolorem',
];

const TableTemplate: Story<ComponentProps<typeof Checkbox>> = args => {
  const [selected, setSelected] = useState<string[]>([ids[3]]);

  const globalChecked = useMemo(() => {
    if (selected.length === 0) {
      return {
        checked: false,
        indeterminate: false,
      };
    }
    if (selected.length === ids.length) {
      return {
        checked: true,
        indeterminate: false,
      };
    }
    return {
      indeterminate: true,
    };
  }, [selected]);

  const handleToggleAll = useCallback(
    () => setSelected(current => (current.length === ids.length ? [] : ids)),
    [],
  );

  const handleToggleItem = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setSelected(selected => {
        if (event.target.checked) {
          return [...selected, id];
        }
        return selected.filter(i => i !== id);
      });
    },
    [],
  );

  return (
    <table className="table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th>
            <Checkbox onChange={handleToggleAll} {...globalChecked} />
          </th>
          <th>Item</th>
        </tr>
      </thead>
      <tbody>
        {ids.map(id => (
          <tr key={id} className="bg-gray-30">
            <td>
              <Checkbox
                checked={selected.includes(id)}
                onChange={handleToggleItem(id)}
              />
            </td>
            <td>{id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const BaseCheckbox = Template.bind({});
BaseCheckbox.args = {
  checked: true,
  indeterminate: false,
  disabled: false,
  dataLayoutId: '',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Click me',
  checked: true,
  indeterminate: false,
  disabled: false,
  dataLayoutId: '',
};

export const TableWithCheckboxes = TableTemplate.bind({});
TableWithCheckboxes.parameters = {
  controls: {
    exclude: [
      'label',
      'checked',
      'indeterminate',
      'disabled',
      'dataLayoutId',
      'onChangeValue',
      'containerClassName',
    ],
  },
};
