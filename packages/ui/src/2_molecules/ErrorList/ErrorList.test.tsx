import { render } from '@testing-library/react';

import React from 'react';

import { ErrorLevel } from '../../1_atoms';
import { ErrorList } from './ErrorList';

const errors = [
  {
    level: ErrorLevel.Critical,
    message: 'Critical',
    dataAttribute: 'w-1',
    weight: 3,
  },
  {
    level: ErrorLevel.Warning,
    message: 'Warning',
    dataAttribute: 'w-3',
    weight: 1,
  },
  {
    level: ErrorLevel.Warning,
    message: 'Warning',
    dataAttribute: 'w-2',
    weight: 2,
  },
];

describe('ErrorList', () => {
  it('renders a ErrorList with correct order', () => {
    const { getByTestId } = render(
      <ErrorList
        dataAttribute="error-list"
        errors={errors}
        showSingleError={false}
      />,
    );
    const errorList = getByTestId('error-list');
    const firstElement = getByTestId('w-3');
    expect(errorList).toBeInTheDocument();
    expect(errorList.childElementCount).toBe(3);
    expect(firstElement.isEqualNode(errorList.firstChild)).toBe(true);
  });

  it('renders single error when showSingleError is true', () => {
    const { container } = render(
      <ErrorList errors={errors} showSingleError={true} />,
    );
    expect(container.childElementCount).toBe(1);
  });
});
