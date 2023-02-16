import React, { FC } from 'react';

import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { applyDataAttr } from '@sovryn/ui';

import { DappLocked } from '../../1_atoms/DappLocked/DappLocked';
import { Header, Footer } from '../../3_organisms';
import { useMaintenance } from '../../../hooks/useMaintenance';

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
  const { checkMaintenance, States } = useMaintenance();
  const dappLocked = checkMaintenance(States.FULLD2);

  return (
    <div
      className={classNames('flex flex-col flex-grow', className)}
      {...applyDataAttr(dataAttribute)}
    >
      {!dappLocked && (
        <>
          <Header />
          <div className={classNames('my-2 px-4 flex-grow', contentClassName)}>
            <Outlet />
          </div>
        </>
      )}
      {dappLocked && <DappLocked />}
      <div className="shrink">
        <Footer />
      </div>
    </div>
  );
};
