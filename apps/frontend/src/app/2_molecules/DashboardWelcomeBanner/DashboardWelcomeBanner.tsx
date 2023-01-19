import React, { FC } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Button } from '@sovryn/ui';

import { useWalletConnect } from '../../../hooks';
import { useAssetBalance } from '../../../hooks/useAssetBalance';

export type DashboardWelcomeBannerProps = {
  className?: string;
};

export const DashboardWelcomeBanner: FC<DashboardWelcomeBannerProps> = ({
  className,
}) => {
  const { account } = useWalletConnect();
  const { value } = useAssetBalance(SupportedTokens.rbtc);

  if (!account) {
    return <div>Get Start Banner</div>;
  }
  if (Number(value) === 0) {
    return (
      <div className="flex justify-end mb-9">
        <Button text="Fund your wallet"></Button>
      </div>
    );
  }
  return (
    <div className="flex justify-end mb-9">
      <Button text="Open line of credit"></Button>
    </div>
  );
};
