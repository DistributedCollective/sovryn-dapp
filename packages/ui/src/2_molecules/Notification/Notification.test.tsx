import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Notification } from './Notification';
import { NotificationType } from './Notification.types';

describe('Notification', () => {
  it('renders a notification', () => {
    const { getByText } = render(<Notification title="Notification" />);
    const notification = getByText('Notification');
    expect(notification).toHaveTextContent('Notification');
  });

  it('renders a notification with content', () => {
    const { getByText } = render(
      <Notification content="Content" title="Notification" />,
    );
    const notification = getByText('Content');
    expect(notification).toHaveTextContent('Content');
  });

  it('should render a notification style with a className equal to the warning type', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Notification
        type={NotificationType.warning}
        content="Content"
        title="Notification"
        onClose={handleClick}
      />,
    );
    const button = getByRole('button');
    const classes = button.closest('div')?.getAttribute('class');
    expect(classes).toContain('warning');
  });

  it('renders a notification with an action button', () => {
    const { getByText } = render(
      <Notification buttonLabel="switch network" title="Notification" />,
    );
    const notification = getByText('switch network');
    expect(notification).toHaveTextContent('switch network');
  });

  it('should called function on close button click', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Notification onClose={handleClick} title="Notification" />,
    );
    userEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
