import { Story } from '@storybook/react';

import { ComponentProps, useReducer, useState } from 'react';

import { Button, Heading } from '../../1_atoms';
import { Dialog } from '../Dialog/Dialog';
import { DialogSize } from '../Dialog/Dialog.types';
import { VerticalTabs } from './VerticalTabs';

export default {
  title: 'Molecule/VerticalTabs',
  component: VerticalTabs,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: Story<ComponentProps<typeof VerticalTabs>> = args => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <VerticalTabs
      {...args}
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
    />
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
  header: props => (
    <Heading>Selected: {props.items[props.selectedIndex].label}</Heading>
  ),
  footer: () => <div>Footer</div>,
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
InDialog.parameters = {
  layout: 'centered',
};
