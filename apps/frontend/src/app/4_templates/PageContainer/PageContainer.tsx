import React, { FC } from 'react';

import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { applyDataAttr } from '@sovryn/ui';

import { Header, Footer } from '../../3_organisms';

type PageContainerProps = {
  className?: string;
  contentClassName?: string;
  dataAttribute?: string;
};

export const PageContainer: FC<PageContainerProps> = ({
  className,
  contentClassName,
  dataAttribute,
}) => (
  <div
    className={classNames('flex flex-col flex-grow', className)}
    {...applyDataAttr(dataAttribute)}
  >
    <Header />
    <div className={classNames('my-2 md:px-4 flex-grow', contentClassName)}>
      <Outlet />
    </div>
    <div className="shrink">
      <Footer />
    </div>
  </div>
);
