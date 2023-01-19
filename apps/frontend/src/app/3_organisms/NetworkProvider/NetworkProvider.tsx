import React, { useEffect } from 'react';

import { interval, startWith } from 'rxjs';

import { getProvider } from '@sovryn/ethers-provider';

import { chains } from '../../../config/chains';
import {
  CacheCallOptions,
  startCall,
} from '../../../store/rxjs/provider-cache';

const BLOCK_FETCH_INTERVAL = 15_000; // 15 seconds

const options: Partial<CacheCallOptions> = {
  ttl: 7_000, // 7 seconds
  fallbackToPreviousResult: true,
};

export const NetworkProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  useEffect(() => {
    const subscription = interval(BLOCK_FETCH_INTERVAL)
      .pipe(startWith(-1))
      .subscribe(() =>
        chains.forEach(({ id }) =>
          startCall(
            `${id}_blockNumber`,
            () => getProvider(id).getBlockNumber(),
            options,
          ),
        ),
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
