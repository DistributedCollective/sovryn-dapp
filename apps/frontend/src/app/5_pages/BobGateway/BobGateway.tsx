import { Network, SatsWagmiConfig } from '@gobob/sats-wagmi';
import { QueryClientProvider } from '@tanstack/react-query';

import React, { FC } from 'react';

import { queryClient } from './BobGateway.utils';
import { BobGatewayForm } from './BobGatewayForm';

const BobGateway: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SatsWagmiConfig network={Network.testnet} queryClient={queryClient}>
        <div className="px-0 container md:mx-9 mx-0 md:mb-2 mb-7">
          <BobGatewayForm />
        </div>
      </SatsWagmiConfig>
    </QueryClientProvider>
  );
};
export default BobGateway;
