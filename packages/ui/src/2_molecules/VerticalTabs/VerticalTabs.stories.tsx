import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import { ComponentProps, useCallback, useReducer, useState } from 'react';

import { Button, Heading } from '../../1_atoms';
import { Dialog } from '../Dialog/Dialog';
import { DialogSize } from '../Dialog/Dialog.types';
import { VerticalTabs } from './VerticalTabs';

const EXCLUDED_CONTROLS = ['header', 'footer', 'onChange'];

export default {
  title: 'Molecule/VerticalTabs',
  component: VerticalTabs,
  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: EXCLUDED_CONTROLS,
    },
  },
};

const Template: Story<ComponentProps<typeof VerticalTabs>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (index: number) => updateArgs({ selectedIndex: index }),
    [updateArgs],
  );

  return (
    <div className="bg-sovryn-black">
      <VerticalTabs {...args} onChange={handleOnChange} />
    </div>
  );
};

const DialogTemplate: Story<ComponentProps<typeof VerticalTabs>> = args => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDialogOpen, toggle] = useReducer(a => !a, false);
  return (
    <>
      <Button onClick={toggle} text="Open Dialog" />
      <Dialog isOpen={isDialogOpen} width={DialogSize.xl2}>
        <VerticalTabs
          {...args}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
          footer={() => (
            <button onClick={toggle} className="text-primary-20 text-xs">
              Close
            </button>
          )}
        />
      </Dialog>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  items: [
    { label: 'Tab 1', content: 'Tab 1 Content' },
    { label: 'Tab 2', content: 'Tab 2 Content' },
    { label: 'Tab 3', content: 'Tab 3 Content' },
    {
      label: 'Tab4 ',
      infoText: 'Example with long content',
      content: (
        <div>
          <Heading>Long List</Heading>
          <ol>
            {new Array(100).fill('Row').map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      ),
    },
  ],
  selectedIndex: 0,
  header: props => (
    <Heading>Selected: {props.items[props.selectedIndex].label}</Heading>
  ),
  footer: () => <div>Footer</div>,
  className: '',
  tabsClassName: '',
  contentClassName: '',
};

Basic.argTypes = {
  items: {
    control: 'VerticalTabsItem[]',
    description: 'List of vertical tab items',
  },
  selectedIndex: {
    control: 'number',
    description: 'Active tab index',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the wrapper',
  },
  tabsClassName: {
    control: 'text',
    description: 'The class to apply to the tabs',
  },
  contentClassName: {
    control: 'text',
    description: 'The class to apply to the content',
  },
  headerClassName: {
    control: 'text',
    description: 'The class to apply to the header',
  },
  footerClassName: {
    control: 'text',
    description: 'The class to apply to the footer',
  },
  onChange: {
    control: 'function',
    description: 'onChange handler for active tab',
  },
  header: {
    control: 'function',
    description: 'Render function for tabs header',
  },
  footer: {
    control: 'function',
    description: 'Render function for tabs footer',
  },
};

export const InDialog = DialogTemplate.bind({});
InDialog.args = {
  items: [
    {
      label: 'Hardware Wallet',
      infoText: 'Select the hardware wallet you want to connect',
      content: 'Content of HW tab',
    },
    {
      label: 'Browser Wallet',
      infoText: 'Select the web3 wallet you want to connect',
      content: 'Tab 2 Content',
    },
    {
      label: "Don't have a wallet",
      infoText: 'Read the following instructions',
      content: 'Tab 3 Content',
    },
  ],
  header: () => <Heading>Connect Wallet</Heading>,
  tabsClassName: 'rounded-l-lg',
  className: 'rounded-lg',
};
InDialog.argTypes = {
  ...Basic.argTypes,
};

InDialog.parameters = {
  layout: 'centered',
  controls: {
    exclude: [...EXCLUDED_CONTROLS, 'selectedIndex'],
  },
};
