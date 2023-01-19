import React, { FC } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Button } from '@sovryn/ui';

import { useWalletConnect } from '../../../hooks';
import { useAssetBalance } from '../../../hooks/useAssetBalance';

export type DashboardWelcomeBannerProps = {
  openLOC: () => void;
  connectWallet: () => void;
};

export const DashboardWelcomeBanner: FC<DashboardWelcomeBannerProps> = ({
  openLOC,
  connectWallet,
}) => {
  const { account } = useWalletConnect();
  const { value, loading } = useAssetBalance(SupportedTokens.rbtc);

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
  if (loading) {
    return null;
  }
  if (Number(value) === 0) {
    return (
      <div className="flex justify-end mb-9">
        <Button
          className="flex-1 md:flex-initial"
          text="Fund your wallet"
        ></Button>
      </div>
    );
  }
  return (
    <div className="flex justify-end mb-9">
      <Button
        className="flex-1 md:flex-initial"
        onClick={openLOC}
        text="Open line of credit"
      ></Button>
    </div>
  );
};
