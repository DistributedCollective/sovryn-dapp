import React, { useEffect } from 'react';

import { reactLocalStorage } from 'reactjs-localstorage';
import { interval, startWith } from 'rxjs';

import { getProvider } from '@sovryn/ethers-provider';

import { APP_CHAIN_LIST } from '../../../config/chains';

import { onboard } from '../../../lib/connector';
import {
  CacheCallOptions,
  startCall,
} from '../../../store/rxjs/provider-cache';

const BLOCK_FETCH_INTERVAL = 15_000; // 15 seconds
const AUTOCONNECT_WALLET_LABEL = 'autoconnect-sovryn-wallet-label';

const options: Partial<CacheCallOptions> = {
  ttl: 7_000, // 7 seconds
  fallbackToPreviousResult: true,
};

export const NetworkProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  useEffect(() => {
    const blockSubscription = interval(BLOCK_FETCH_INTERVAL)
      .pipe(startWith(-1))
      .subscribe(() =>
        APP_CHAIN_LIST.forEach(({ id }) =>
          startCall(
            `${id}_blockNumber`,
            () => getProvider(id).getBlockNumber(),
            options,
          ),
        ),
      );

    const walletSubscription = onboard.state
      .select('wallets')
      .subscribe(wallets => {
        if (wallets.length > 0) {
          const { label } = wallets[0];
          reactLocalStorage.set(AUTOCONNECT_WALLET_LABEL, label);
        } else {
          reactLocalStorage.remove(AUTOCONNECT_WALLET_LABEL);
        }
      });

    const selected = reactLocalStorage.get<string>(AUTOCONNECT_WALLET_LABEL);
    if (selected) {
      onboard.connectWallet(selected);
    }

    return () => {
      blockSubscription.unsubscribe();
      walletSubscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
