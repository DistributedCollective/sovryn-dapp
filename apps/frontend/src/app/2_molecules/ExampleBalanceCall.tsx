import React, { useMemo } from 'react';

import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import { FormGroup, Select } from '@sovryn/ui';

import { defaultChainId } from '../../config/chains';

import { useAssetBalance } from '../../hooks/useAssetBalance';
import { fromWei } from '../../utils/math';

// just an usage example, to be removed
export const ExampleBalanceCall = () => {
  const [token, setToken] = React.useState(SupportedTokens.rbtc);

  const options = useMemo(
    () =>
      SupportedTokenList.map(item => ({
        value: item.symbol,
        label: item.symbol,
      })),
    [],
  );

  const result = useAssetBalance(token, defaultChainId);

  return (
    <div className="bg-gray-50 p-4 my-8">
      <h1 className="mb-2">useAssetBalance hook:</h1>
      <div className="flex flex-row gap-4 mb-3">
        <FormGroup label="Token:">
          <Select value={token} options={options} onChange={setToken} />
        </FormGroup>
      </div>

      <div className="flex flex-row gap-4">
        <div>
          Balance: {fromWei(result.value)} {token}
        </div>
      </div>
      {result.error && (
        <div className="text-red-500">{result.error.message}</div>
      )}
    </div>
  );
};
