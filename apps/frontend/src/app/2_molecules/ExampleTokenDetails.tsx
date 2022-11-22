import React, { useEffect, useMemo, useState } from 'react';

import {
  TokenDetailsData,
  getTokenDetails,
  SupportedTokens,
  SupportedTokenList,
} from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';
import { Select } from '@sovryn/ui';

// TODO: Just for testing, should be deleted later.
export const ExampleTokenDetails: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState(
    SupportedTokenList[0].symbol,
  );
  const [tokenDetails, setTokenDetails] = useState<TokenDetailsData>();

  const tokenOptions = useMemo(
    () =>
      SupportedTokenList.map(item => ({
        value: item.symbol,
        label: item.symbol,
      })),
    [],
  );

  useEffect(() => {
    const getDetails = async () => {
      const details: TokenDetailsData = await getTokenDetails(
        SupportedTokens[selectedToken],
        ChainIds.RSK_MAINNET,
      );

      return details;
    };
    getDetails().then(setTokenDetails);
  }, [selectedToken]);

  return (
    <div className="mt-4">
      <div>
        <Select
          options={tokenOptions}
          value={selectedToken}
          onChange={setSelectedToken}
        />
      </div>
      <div>
        <div>Token details for {selectedToken} on RSK Mainnet</div>
        <div>address: {tokenDetails?.address}</div>
        <div>symbol: {tokenDetails?.symbol}</div>
        <div>decimalPrecision: {tokenDetails?.decimalPrecision}</div>
        <div>
          logo:{' '}
          <div dangerouslySetInnerHTML={{ __html: tokenDetails?.icon || '' }} />
        </div>
      </div>
    </div>
  );
};
