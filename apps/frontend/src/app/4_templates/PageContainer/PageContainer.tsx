import React, { FC } from 'react';

import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import { applyDataAttr } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { DappLocked } from '../../1_atoms/DappLocked/DappLocked';
import { Header, Footer } from '../../3_organisms';
import { UnclaimcedVestingAlert } from '../../5_pages/RewardsPage/components/Vesting/components/UnclaimedVestingAlert/UnclaimedVestingAlert';
import { useIsDappLocked } from '../../../hooks/maintenances/useIsDappLocked';
import { useAccount } from '../../../hooks/useAccount';
import { useCurrentChain } from '../../../hooks/useChainStore';

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
  const { account } = useAccount();
  const chainID = useCurrentChain();
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
          {account && chainID === RSK_CHAIN_ID && <UnclaimcedVestingAlert />}
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
