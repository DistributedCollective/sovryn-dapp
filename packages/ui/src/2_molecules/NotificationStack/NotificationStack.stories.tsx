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
  const onClose = (id: number | string) => {
    console.log('onClose', id, items);
    setItems(items.filter(item => id !== item.id));
  };
  // fireTime and timeout
  // now >fireTime + timeout;
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
