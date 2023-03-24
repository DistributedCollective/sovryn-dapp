import React from 'react';

import { Await, useLoaderData } from 'react-router-dom';

import { ErrorRenderer } from '../../1_atoms/ErrorRenderer/ErrorRenderer';
import { LoaderWithLogo } from '../../1_atoms/LoaderWithLogo/LoaderWithLogo';

export const withDeferedLoaderData = <
  T extends object,
  C extends { defered: T },
>(
  Component: React.ComponentType<C>,
  key?: string,
) => {
  return (props: C) => {
    const data = useLoaderData() as T;
    return (
      <React.Suspense fallback={<LoaderWithLogo />}>
        <Await
          resolve={key ? data[key] : data}
          errorElement={<ErrorRenderer />}
        >
          {(data: T) => <Component {...props} defered={data} />}
        </Await>
      </React.Suspense>
    );
  };
};
