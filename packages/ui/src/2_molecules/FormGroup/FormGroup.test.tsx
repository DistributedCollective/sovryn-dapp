import { render } from '@testing-library/react';

import React from 'react';

import { Input } from '../../1_atoms';
import { FormGroup } from './FormGroup';

test('renders FormGroup with label and subtext', () => {
  const { getByTestId, getByText } = render(
    <FormGroup
      className={''}
      label={'label'}
      subtext={'subtext'}
      children={<Input placeholder="Text" dataLayoutId="form-input" />}
      dataLayoutId="group-1"
    />,
  );
  expect(getByTestId('group-1')).toBeDefined();
  expect(getByText('label')).toBeDefined();
  expect(getByText('subtext')).toBeDefined();
  expect(getByTestId('form-input')).toBeDefined();
});

test('FromGroup renders erorr message', () => {
  const { getByTestId } = render(
    <FormGroup
      className={''}
      label={'label'}
      children={<Input placeholder="Text" />}
      errorLabel="wrong"
    />,
  );

  expect(getByTestId('error-message')).toHaveTextContent('wrong');
});
