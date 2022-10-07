import React, { FC, PropsWithChildren, useEffect, useState } from 'react';

import classNames from 'classnames';

import { Chain, getProvider } from '@sovryn/ethers-provider';

import styles from './ConnectWalletButton.module.css';

export type ConnectWalletButtonProps = {
  onDisconnect: () => void;
  address: string;
  className?: string;
  dataActionId?: string;
  hideSubmenu?: boolean;
};

export const ConnectWalletButton: FC<
  PropsWithChildren<ConnectWalletButtonProps>
> = ({ address, onDisconnect, className, hideSubmenu = false }) => {
  const [address, setAddress] = useState();
useEffect(() => {
  const sub = onboard.state.select('wallets').pipe(startWith(state.get().wallets), takeLast()).subscribe(wallets => {
   if (wallets.length) {
     console.log('connected', wallets[0].address);
     setAddress(wallets[0].address);
   } else {
     console.log('not connected');
     setAddress(undefined);
   }
  });
}, []);

  return <div>ConnectWalletButton</div>;
};
