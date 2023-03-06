import React, { FC } from 'react';

import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { applyDataAttr, Header } from '@sovryn/ui';

import { SovrynLogo } from '../../2_molecules';
import { Footer } from '../../3_organisms';

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
      <div className={classNames('flex-grow', contentClassName)}>
        <Outlet />
      </div>
    </>
    <div className="shrink">
      <Footer isEmailPage />
    </div>
  </div>
);
