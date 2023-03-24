import baseLoadable from '@loadable/component';

import React from 'react';

import { LoaderWithLogo } from '../app/1_atoms/LoaderWithLogo/LoaderWithLogo';

export const loadable = (func: () => any, options?: any) =>
  baseLoadable(func, {
    fallback: <LoaderWithLogo />,
    ...options,
  });
