import React, { FC } from 'react';

import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { applyDataAttr, Header } from '@sovryn/ui';

import { SovrynLogo } from '../../2_molecules';
import { Footer } from '../../3_organisms';

type EmailVerificationStateContainerProps = {
  className?: string;
  contentClassName?: string;
  dataAttribute?: string;
};

export const EmailVerificationStateContainer: FC<
  EmailVerificationStateContainerProps
> = ({ className, contentClassName, dataAttribute }) => (
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
      <Footer showDashboardLink />
    </div>
  </div>
);
