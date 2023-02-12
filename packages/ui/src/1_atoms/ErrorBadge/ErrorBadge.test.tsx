import { render } from '@testing-library/react';

import React from 'react';

import { ErrorBadge } from './ErrorBadge';
import { ErrorLevel } from './ErrorBadge.types';

describe('ErrorBadge', () => {
  it('renders a ErrorBadge', () => {
    const { getByTestId } = render(
      <ErrorBadge
        message="recovery mode"
        level={ErrorLevel.Warning}
        dataAttribute="error"
      />,
    );
    const errorBadge = getByTestId('error');
    expect(errorBadge).toBeInTheDocument();
  });

  it('renders a ErrorBadge', () => {
    const { getByTestId } = render(
      <ErrorBadge
        message="recovery mode"
        level={ErrorLevel.Warning}
        dataAttribute="error"
      />,
    );
    const errorBadge = getByTestId('error');
    expect(errorBadge).toHaveTextContent('recovery mode');
  });
});
