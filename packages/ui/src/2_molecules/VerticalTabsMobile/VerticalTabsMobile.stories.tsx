import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import { ComponentProps, FC, useCallback, useReducer, useState } from 'react';

import { Button, Heading, Icon } from '../../1_atoms';
import { Dialog } from '../Dialog/Dialog';
import { DialogSize } from '../Dialog/Dialog.types';
import { VerticalTabsMobile } from './VerticalTabsMobile';

type ButtonBackProps = {
  onClick: () => void;
};

const EXCLUDED_CONTROLS = ['header', 'onChange'];

export default {
  title: 'Molecule/VerticalTabsMobile',
  component: VerticalTabsMobile,
  parameters: {
    layout: 'fullscreen',
    controls: {
      exclude: EXCLUDED_CONTROLS,
    },
  },
};

const ButtonBack: FC<ButtonBackProps> = ({ onClick }) => {
  return (
    <button className="flex items-center text-sm mb-11" onClick={onClick}>
      <Icon
        icon="arrow-back"
        className="bg-gray-70 w-6 h-6 p-1 mr-2 rounded flex items-center justify-center"
        size={14}
      />
      Back to wallet menu
    </button>
  );
};

const Template: Story<ComponentProps<typeof VerticalTabsMobile>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (index: number | null) => updateArgs({ selectedIndex: index }),
    [updateArgs],
  );

  return (
    <div className="flex flex-col justify-center h-screen">
      <VerticalTabsMobile {...args} onChange={handleOnChange} />
    </div>
  );
};

const DialogTemplate: Story<ComponentProps<typeof VerticalTabsMobile>> = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDialogOpen, toggle] = useReducer(a => !a, false);
  return (
    <>
      <Button onClick={toggle} text="Open Dialog" />
      <Dialog isOpen={isDialogOpen} width={DialogSize.xl2}>
        <VerticalTabsMobile
          className="rounded-lg"
          tabsClassName="rounded-l-lg"
          header={() => (
            <p className="text-sm text-gray-10">
              Select the type of wallet you have
            </p>
          )}
          items={[
            {
              label: 'Tab 1',
              content: (
                <>
                  <ButtonBack onClick={() => setSelectedIndex(null)} />
                  Tab 1 Content
                </>
              ),
            },
            {
              label: 'Tab 2',
              content: (
                <>
                  <ButtonBack onClick={() => setSelectedIndex(null)} />
                  Tab 2 Content
                </>
              ),
            },
          ]}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        />
      </Dialog>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  items: [
    {
      label: 'Tab 1',
      content: (
        <>
          <ButtonBack onClick={() => alert('backButton clicked')} />
          Tab 1 Content
        </>
      ),
    },
    {
      label: 'Tab 2',
      content: (
        <>
          <ButtonBack onClick={() => alert('backButton clicked')} />
          Tab 2 Content
        </>
      ),
    },
    {
      label: 'Tab 3',
      content: (
        <>
          <ButtonBack onClick={() => alert('backButton clicked')} />
          Tab 3 Content
        </>
      ),
    },
    {
      label: 'Tab4 ',
      infoText: 'Example with long content',
      content: (
        <div>
          <button onClick={() => alert('backButton clicked')}>
            <Icon icon="arrow-back" size={14} />
            Back to wallet menu
          </button>{' '}
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
  header: () => <p className="text-sm text-gray-10">Select the tab</p>,
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
  onChange: {
    control: 'function',
    description: 'onChange handler for active tab',
  },
  header: {
    control: 'function',
    description: 'Render function for tabs header',
  },
};

export const InDialog = DialogTemplate.bind({});

InDialog.parameters = {
  layout: 'centered',
};
InDialog.argTypes = { ...Basic.argTypes };
