import React, { FC } from 'react';

import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { applyDataAttr, Header } from '@sovryn/ui';

import { SovrynLogo } from '../../2_molecules';
import { PageEmailContainerFooter } from './components/PageEmailContainerFooter/PageEmailContainerFooter';

type PageEmailContainerProps = {
  className?: string;
  contentClassName?: string;
  dataAttribute?: string;
};

export const PageEmailContainer: FC<PageEmailContainerProps> = ({
  className,
  contentClassName,
  dataAttribute,
}) => (
  <div
    className={classNames('flex flex-col flex-grow', className)}
    {...applyDataAttr(dataAttribute)}
  >
    <>
      <Header
        logo={<SovrynLogo dataAttribute="header-logo" link="/" />}
        menuIcon={<SovrynLogo dataAttribute="header-logo" link="/" />}
      />
      <div className={classNames('flex-grow min-h-[34rem]', contentClassName)}>
        <Outlet />
      </div>
    </>
    <div className="shrink">
      <PageEmailContainerFooter />
    </div>
  </div>
);
