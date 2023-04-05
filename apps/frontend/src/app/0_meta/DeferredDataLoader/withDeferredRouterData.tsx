import React from 'react';

import { Await, useLoaderData } from 'react-router-dom';

import { ErrorRenderer } from '../../1_atoms/ErrorRenderer/ErrorRenderer';
import { LoaderWithLogo } from '../../1_atoms/LoaderWithLogo/LoaderWithLogo';

interface WithDeferredRouterDataProps<T> {
  deferred: T;
}

export const withDeferredLoaderData =
  <T extends object, C extends WithDeferredRouterDataProps<T>>(
    Component: React.ComponentType<C>,
    key?: string,
  ) =>
  (props: C) => {
    const data = useLoaderData() as T;
    return (
      <React.Suspense fallback={<LoaderWithLogo />}>
        <Await
          resolve={key ? data[key] : data}
          errorElement={<ErrorRenderer />}
        >
          {(data: T) => <Component {...props} deferred={data} />}
        </Await>
      </React.Suspense>
    );
  };
