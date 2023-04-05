import React, { FC, PropsWithChildren, useLayoutEffect } from 'react';

export const LoaderProvider: FC<PropsWithChildren> = ({ children }) => {
  useLayoutEffect(() => {
    const elem = document.getElementById('bootstrap');
    if (elem) {
      elem.setAttribute('style', 'opacity: 0');
      const timeout = setTimeout(() => {
        elem.remove();
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);
  return <>{children}</>;
};
