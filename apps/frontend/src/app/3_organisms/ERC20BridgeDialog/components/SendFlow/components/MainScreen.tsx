import React, { useState } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';
import { AmountInput, Paragraph, Select } from '@sovryn/ui';

import { useAssetsBySourceChain } from '../../../hooks/useBridgeAssets';

export const MainScreen: React.FC = () => {
  const assets = useAssetsBySourceChain(ChainIds.RSK_TESTNET);

  const [token, setToken] = useState('');

  return (
    <div>
      <div className="mb-6">
        <Paragraph className="mb-2">Asset</Paragraph>

        <Select
          className="w-full"
          onChange={setToken}
          options={assets.map(asset => ({
            value: asset.id,
            label: asset.symbol,
          }))}
          value={token}
        />
      </div>

      <div className="mb-6">
        <Paragraph className="mb-2">Send to</Paragraph>

        <Select
          className="w-full"
          onChange={setToken}
          options={assets.map(asset => ({
            value: asset.id,
            label: asset.symbol,
          }))}
          value={token}
        />
      </div>
      <div>
        <AmountInput
          className="w-full"
          label="Avaiaible liquidity"
          value="12,345.13 ETH"
          disabled
        />
      </div>
    </div>
  );
};
