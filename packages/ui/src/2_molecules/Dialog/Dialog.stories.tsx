import React, { ComponentProps, useCallback, useState } from 'react';
import { Story } from '@storybook/react';

import { Dialog } from './Dialog';
import { Button } from '../../1_atoms';

export default {
  title: 'Molecule/Dialog',
  component: Dialog,
};

const Template: Story<ComponentProps<typeof Dialog>> = args => (
  <Dialog {...args} />
);

const NotClosableTemplate: Story<ComponentProps<typeof Dialog>> = args => (
  <Dialog {...args} onClose={undefined} />
);

const InteractiveTemplate: Story<ComponentProps<typeof Dialog>> = args => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen(open => !open), []);

  return (
    <div className="relative mx-auto w-80 h-80 p-8 bg-gray-3 text-center">
      <Button onClick={toggleOpen} text="open" />
      <Dialog {...args} isOpen={open} onClose={toggleOpen} />
    </div>
  );
};

const ChildDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen(open => !open), []);

  return (
    <>
      <Button onClick={toggleOpen} text="open" />
      <Dialog isOpen={open} onClose={toggleOpen}>
        Opens on top of parent.
      </Dialog>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  children: 'Dialog Active',
  isOpen: true,
};

export const NotClosable = NotClosableTemplate.bind({});
NotClosable.args = {
  children: 'Dialog Active',
  isOpen: true,
};

export const LongContent = Template.bind({});
LongContent.args = {
  children: (
    <div>
      {Array(50)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="py-4">
            Item #{i}
          </div>
        ))}
    </div>
  ),
  isOpen: true,
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  children: 'Dialog Active',
};

export const MultipleDialogs = InteractiveTemplate.bind({});
MultipleDialogs.args = {
  children: <ChildDialog />,
};
