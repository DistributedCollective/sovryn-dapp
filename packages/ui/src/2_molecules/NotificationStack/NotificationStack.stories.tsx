import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { NotificationType } from '../Notification/Notification.types';
import { NotificationStack } from './NotificationStack';

export default {
  title: 'Molecule/NotificationStack',
  component: Notification,
};

const Template: Story<ComponentProps<typeof NotificationStack>> = args => {
  const [items, setItems] = useState([...args.items]);
  const onClose = (id: number) =>
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
      className: '',
      timeout: 0,
      dismissible: true,
      id: 1,
    },
    {
      type: NotificationType.warning,
      title: 'Contract is paused',
      dataAttribute: '',
      className: 'mt-4',
      content: 'test',
      timeout: 0,
      dismissible: true,
      id: 2,
    },
  ],
};
