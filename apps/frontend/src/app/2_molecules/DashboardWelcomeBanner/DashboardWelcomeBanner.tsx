import React, { FC } from 'react';

import { Button } from '@sovryn/ui';

import { useWalletConnect } from '../../../hooks';
import { ConnectedUserBanner } from './components/ConnectedUserBanner/ConnectedUserBanner';

export type DashboardWelcomeBannerProps = {
  openLOC: () => void;
  connectWallet: () => void;
};

export const DashboardWelcomeBanner: FC<DashboardWelcomeBannerProps> = ({
  openLOC,
  connectWallet,
}) => {
  const { account } = useWalletConnect();

  if (!account) {
    return (
      <div className="flex justify-center mb-9">
        Get Started Banner!!
        <Button
          className="ml-2"
          text="Get Started!"
          onClick={connectWallet}
        ></Button>
      </div>
    );
  }
  return <ConnectedUserBanner openLOC={openLOC} />;
};
