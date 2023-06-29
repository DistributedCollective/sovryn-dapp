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
  dataAttribute: '',
};
BaseCheckbox.argTypes = {
  containerClassName: {
    control: 'text',
    description: 'The class to apply to the checkbox wrapper',
  },
  label: {
    control: 'text',
    description:
      'The content of the checkbox. Can be text, other components, or HTML elements.',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  indeterminate: {
    control: 'boolean',
    description:
      'Used to indicate that some, but not all, child checkboxes within a group are selected',
  },
  disabled: {
    control: 'boolean',
    description: 'Checkbox disabled state',
  },
  onChangeValue: {
    control: 'function',
    description:
      'The onChangeValue handler for the input, triggered whenever the checkbox value changes',
  },
  onChange: {
    control: 'function',
    note: '@deprecated Use onChangeValue if possible',
    description:
      'The onChangeValue handler for the input, triggered whenever the checkbox value changes',
  },
  checked: {
    control: 'boolean',
    description: 'Checkbox checked state',
  },
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Click me',
  checked: true,
  indeterminate: false,
  disabled: false,
  dataAttribute: '',
};
WithLabel.argTypes = {
  ...BaseCheckbox.argTypes,
};

export const TableWithCheckboxes = TableTemplate.bind({});
TableWithCheckboxes.parameters = {
  controls: {
    exclude: [
      'label',
      'checked',
      'indeterminate',
      'disabled',
      'dataAttribute',
      'onChangeValue',
      'containerClassName',
    ],
  },
};
TableWithCheckboxes.argTypes = {
  ...BaseCheckbox.argTypes,
};
