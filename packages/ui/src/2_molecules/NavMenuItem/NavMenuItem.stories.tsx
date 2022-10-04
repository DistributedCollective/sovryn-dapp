import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { NavMenuItem } from './NavMenuItem';

export default {
  title: 'Molecule/NavMenuItem',
  component: NavMenuItem,
};

const Template: Story<ComponentProps<typeof NavMenuItem>> = () => (
  <>
    <NavMenuItem children="Zero" count={10} />
    <NavMenuItem children="Perpetual" className="mx-5" />
    <NavMenuItem children="999 notifications" count={999} className="mr-5" />
    <NavMenuItem children="Selected item" count={2} isActive />
  </>
);

export const Basic = Template.bind({});

const InteractiveTemplate: Story<ComponentProps<typeof NavMenuItem>> = args => {
  const [active, setActive] = useState(false);
  const onClick = useCallback(() => setActive(active => !active), []);

  return <NavMenuItem {...args} onClick={onClick} isActive={active} />;
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  children: 'Menu item',
  count: 1,
  className: 'm-2',
};
