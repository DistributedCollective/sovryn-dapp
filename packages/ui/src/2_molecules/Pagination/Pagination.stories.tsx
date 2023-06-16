import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { Pagination } from './Pagination';

export default {
  title: 'Molecule/Pagination',
  component: Pagination,
};

const Template: Story<ComponentProps<typeof Pagination>> = args => {
  const [page, setPage] = useState(0);
  return <Pagination {...args} page={page} onChange={setPage} />;
};

export const Basic = Template.bind({});
Basic.args = {
  className: '',
  dataAttribute: '',
  itemsPerPage: 6,
  totalItems: 22,
};

Basic.argTypes = {
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the pagination',
  },
  itemsPerPage: {
    control: 'number',
    description: 'The page size state for the pagination',
  },
  page: {
    control: 'number',
    description: 'The page state for the pagination',
  },
  totalItems: {
    control: 'number',
    description: 'The totalItems state for the pagination',
  },
  onChange: {
    control: 'function',
    description: 'The onChange handler for the pagination',
  },
  hideFirstPageButton: {
    control: 'boolean',
    description: 'The option to hide first page button',
  },
  hideLastPageButton: {
    control: 'boolean',
    description: 'The option to hide last page button',
  },
  isNextButtonDisabled: {
    control: 'boolean',
    description: 'The option to disable next page button',
  },
};

const _WithNoTotalItems: Story<ComponentProps<typeof Pagination>> = args => {
  const [page, setPage] = useState(0);
  return <Pagination {...args} page={page} onChange={setPage} />;
};

export const WithNoTotalItems = _WithNoTotalItems.bind({});
_WithNoTotalItems.args = {
  className: '',
  dataAttribute: '',
  itemsPerPage: 6,
};
_WithNoTotalItems.argTypes = {
  ...Basic.argTypes,
};
