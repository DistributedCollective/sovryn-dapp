import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { Button } from '../../1_atoms';
import { Dialog } from './Dialog';
import { DialogSize } from './Dialog.types';
import { DialogBody } from './components/DialogBody/DialogBody';
import { DialogHeader } from './components/DialogHeader/DialogHeader';

export default {
  title: 'Molecule/Dialog',
  component: Dialog,
  parameters: {
    backgrounds: {
      // set background to lighter color to make dialog more visible
      default: 'gray-10',
    },
  },
  argTypes: {
    children: {
      type: {
        required: true,
      },
    },
    className: {
      defaultValue: '',
    },
    dataAttribute: {
      defaultValue: '',
    },
    width: {
      defaultValue: DialogSize.md,
    },
  },
};

const Template: Story<ComponentProps<typeof Dialog>> = ({
  children,
  ...args
}) => (
  <Dialog {...args}>
    <DialogBody>{children}</DialogBody>
  </Dialog>
);

const NotClosableTemplate: Story<ComponentProps<typeof Dialog>> = ({
  children,
  ...args
}) => (
  <Dialog {...args} onClose={undefined}>
    <DialogHeader title="Dialog" />
    <DialogBody>{children}</DialogBody>
  </Dialog>
);

const TemplateWithHeader: Story<ComponentProps<typeof Dialog>> = ({
  children,
  ...args
}) => (
  <Dialog {...args}>
    <DialogHeader title="Dialog title" onClose={args.onClose} />
    <DialogBody>{children}</DialogBody>
  </Dialog>
);

const InteractiveTemplate: Story<ComponentProps<typeof Dialog>> = ({
  children,
  ...args
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen(open => !open), []);

  return (
    <div className="relative mx-auto min-h-screen flex items-center justify-center">
      <Button onClick={toggleOpen} text="open" />
      <Dialog {...args} isOpen={open} onClose={toggleOpen}>
        <DialogHeader title="Dialog title" onClose={toggleOpen} />
        <DialogBody>{children}</DialogBody>
      </Dialog>
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
        <DialogBody>Opens on top of parent.</DialogBody>
      </Dialog>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  children: 'Dialog Active',
  isOpen: true,
};

export const BasicHeader = TemplateWithHeader.bind({});
BasicHeader.args = {
  children: 'Dialog Active',
  isOpen: true,
};

export const NotClosable = NotClosableTemplate.bind({});
NotClosable.args = {
  children: 'Dialog Active',
  isOpen: true,
};

export const LongContent = TemplateWithHeader.bind({});
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
