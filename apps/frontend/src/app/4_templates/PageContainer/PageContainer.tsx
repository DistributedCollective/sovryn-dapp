import React, { FC } from 'react';

import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { applyDataAttr } from '@sovryn/ui';

import { DappLocked } from '../../1_atoms/DappLocked/DappLocked';
import { Header, Footer } from '../../3_organisms';
import { useIsDappLocked } from '../../../hooks/maintenances/useIsDappLocked';

type PageContainerProps = {
  className?: string;
  contentClassName?: string;
  dataAttribute?: string;
};

export const PageContainer: FC<PageContainerProps> = ({
  className,
  contentClassName,
  dataAttribute,
}) => {
  const dappLocked = useIsDappLocked();
  return (
    <div
      className={classNames('flex flex-col flex-grow', className)}
      {...applyDataAttr(dataAttribute)}
    >
      {dappLocked ? (
        <DappLocked />
      ) : (
        <>
          <Header />
          <div
            className={classNames('my-2 px-4 flex flex-grow', contentClassName)}
          >
            <Outlet />
          </div>
        </>
      )}
      <div className="shrink">
        <Footer />
      </div>
    </div>
  );
};
