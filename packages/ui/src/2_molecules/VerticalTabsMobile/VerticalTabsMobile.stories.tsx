import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import { ComponentProps, useCallback, useReducer, useState } from 'react';

import { Button, Heading, Icon } from '../../1_atoms';
import { Dialog } from '../Dialog/Dialog';
import { DialogSize } from '../Dialog/Dialog.types';
import { VerticalTabsMobile } from './VerticalTabsMobile';

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

const Template: Story<ComponentProps<typeof VerticalTabsMobile>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (index: number | null) => updateArgs({ selectedIndex: index }),
    [updateArgs],
  );

  return <VerticalTabsMobile {...args} onChange={handleOnChange} />;
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
          header={() => <p>Select the type of wallet you have</p>}
          items={[
            {
              label: 'Tab 1',
              content: (
                <>
                  <button onClick={() => setSelectedIndex(null)}>
                    <Icon icon="arrow-back" size={14} />
                    Back to wallet menu
                  </button>
                  Tab 1 Content
                </>
              ),
            },
            {
              label: 'Tab 2',
              content: (
                <>
                  <button onClick={() => setSelectedIndex(null)}>
                    <Icon icon="arrow-back" size={14} />
                    Back to wallet menu
                  </button>
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
          <button onClick={() => alert('backButton clicked')}>
            <Icon icon="arrow-back" size={14} />
            Back to wallet menu
          </button>{' '}
          Tab 1 Content
        </>
      ),
    },
    {
      label: 'Tab 2',
      content: (
        <>
          <button onClick={() => alert('backButton clicked')}>
            <Icon icon="arrow-back" size={14} />
            Back to wallet menu
          </button>{' '}
          Tab 2 Content
        </>
      ),
    },
    {
      label: 'Tab 3',
      content: (
        <>
          <button onClick={() => alert('backButton clicked')}>
            <Icon icon="arrow-back" size={14} />
            Back to wallet menu
          </button>{' '}
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
  header: () => <p>Select the tab</p>,
  className: '',
  tabsClassName: '',
  contentClassName: '',
};

export const InDialog = DialogTemplate.bind({});

InDialog.parameters = {
  layout: 'centered',
};
