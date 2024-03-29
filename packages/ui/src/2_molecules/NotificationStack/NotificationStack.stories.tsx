import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { NotificationType } from '../Notification/Notification.types';
import { NotificationStack } from './NotificationStack';

export default {
  title: 'Molecule/NotificationStack',
  component: NotificationStack,
};

const Template: Story<ComponentProps<typeof NotificationStack>> = args => {
  const [items, setItems] = useState([...args.items]);
  const onClose = (id: number | string) =>
    setItems(items.filter(item => id !== item.id));

  return <NotificationStack items={items} onClose={onClose} />;
};

export const Basic = Template.bind({});
Basic.args = {
  items: [
    {
      type: NotificationType.success,
      title: 'Transaction approved',
      content: '',
      dataAttribute: '',
      dismissible: true,
      id: 1,
    },
    {
      type: NotificationType.warning,
      title: 'Contract is paused',
      dataAttribute: '',
      content: 'test',
      dismissible: true,
      id: 2,
    },
    {
      type: NotificationType.warning,
      title: 'Contract is paused',
      dataAttribute: '',
      content: 'test test',
      dismissible: true,
      id: 3,
    },
  ],
};
Basic.argTypes = {
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the notification stack',
  },
  onClose: {
    control: 'function',
    description:
      'The onClose handler for the notification. Triggered when user closes the notification',
  },
  items: {
    control: 'NotificationItem[]',
    description: 'The list of notification items to render on the stack',
  },
};
