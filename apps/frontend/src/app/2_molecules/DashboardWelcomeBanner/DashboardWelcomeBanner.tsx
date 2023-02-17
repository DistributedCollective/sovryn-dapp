import React, { FC, useMemo } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '@sovryn/ui';

import bannerDesktop from '../../../assets/images/Desktop_Banner_1.2.svg';
import bannerMobile from '../../../assets/images/Mobile_Banner.svg';
import { useWalletConnect } from '../../../hooks';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { ConnectedUserBanner } from './components/ConnectedUserBanner/ConnectedUserBanner';

export type DashboardWelcomeBannerProps = {
  openLOC: () => void;
  connectWallet: () => void;
  className?: string;
};

export const DashboardWelcomeBanner: FC<DashboardWelcomeBannerProps> = ({
  openLOC,
  connectWallet,
  className,
}) => {
  const { account } = useWalletConnect();
  const { isMobile } = useIsMobile();

  const banner = useMemo(
    () => (isMobile ? bannerMobile : bannerDesktop),
    [isMobile],
  );

  if (!account) {
    return (
      <div
        className={classNames('flex justify-center cursor-pointer', className)}
        onClick={connectWallet}
      >
        <img
          src={banner}
          alt="welcome banner"
          {...applyDataAttr('zero-dashboard-banner')}
        />
      </div>
    );
  }
  return <ConnectedUserBanner openLOC={openLOC} />;
};
