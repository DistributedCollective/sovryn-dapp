import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '@sovryn/ui';

import { Header, Footer } from '../../3_organisms';

type PageContainerProps = {
  className?: string;
  contentClassName?: string;
  dataAttribute?: string;
  children?: ReactNode;
};

export const PageContainer: FC<PageContainerProps> = ({
  className,
  contentClassName,
  dataAttribute,
  children,
}) => (
  <div
    className={classNames('flex flex-col flex-grow', className)}
    {...applyDataAttr(dataAttribute)}
  >
    <Header />
    <div className={classNames('my-2 px-4 flex-grow', contentClassName)}>
      {children}
    </div>
    <div className="shrink">
      <Footer />
    </div>
  </div>
);
