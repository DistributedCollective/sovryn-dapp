import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { Button, ButtonStyle, Link } from '../../1_atoms';
import { Notification } from './Notification';
import { NotificationType } from './Notification.types';

export default {
  title: 'Molecule/Notification',
  component: Notification,
};

const Template: Story<ComponentProps<typeof Notification>> = args => (
  <Notification {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  type: NotificationType.success,
  title: 'Transaction approved',
  content: '',
  dataAttribute: '',
  className: '',
};

const AdvancedTemplate: Story<ComponentProps<typeof Notification>> = args => {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => {
    alert('Fired onClick event');
    setOpen(false);
  }, []);

  return (
    <>
      <Button text="Show notification" onClick={() => setOpen(true)} />
      <br />
      {open && (
        <Notification
          {...args}
          onClose={() => setOpen(false)}
          content={
            <>
              <div>
                Critical Staking Vulnerability Fix
                <br />
                <Link
                  text="Learn More"
                  href="https://forum.sovryn.app/t/sip-0050-critical-staking-vulnerablity-fix/2714"
                />
              </div>
              <Button
                className="mb-2 mt-7"
                style={ButtonStyle.secondary}
                text="Switch"
                onClick={handleClose}
              />
            </>
          }
        />
      )}
    </>
  );
};

export const Advanced = AdvancedTemplate.bind({});
Advanced.args = {
  type: NotificationType.warning,
  title: 'Contract is paused',
  dataAttribute: '',
  className: 'mt-4',
};
