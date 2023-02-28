import React, { useCallback, useMemo } from 'react';

import { ethers } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Button, FormGroup, Input, InputSize, Select } from '@sovryn/ui';

import { chains, defaultChainId } from '../../config/chains';

import { AssetValue } from './AssetValue/AssetValue';

// just an usage example, to be removed
export const ExampleProviderCall = () => {
  const [chainId, setChainId] = React.useState(defaultChainId);
  const [balance, setBalance] = React.useState('0');
  const [symbol, setSymbol] = React.useState('RBTC');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [address, setAddress] = React.useState(ethers.constants.AddressZero);

  const options = useMemo(
    () => chains.map(item => ({ value: item.id, label: item.label })),
    [],
  );

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(e.currentTarget.value);
    },
    [],
  );

  const getSymbol = useCallback(
    () =>
      setSymbol(
        chains.find(item => item.id === chainId)?.token || SupportedTokens.rbtc,
      ),
    [chainId],
  );

  const handleGetBalance = useCallback(() => {
    setLoading(true);
    setError(undefined);

    getProvider(chainId)
      .getBalance(address)
      .then(result => {
        setBalance(ethers.utils.formatEther(result));
      })
      .catch(error => {
        setError(error.message);
        setBalance('0');
      })
      .finally(() => {
        getSymbol();
        setLoading(false);
      });
  }, [address, chainId, getSymbol]);

  return (
    <div className="bg-gray-50 p-4">
      <div className="flex flex-row gap-4 mb-3">
        <FormGroup label="Chain">
          <Select value={chainId} options={options} onChange={setChainId} />
        </FormGroup>
        <FormGroup label="Address">
          <Input
            value={address}
            onChange={handleAddressChange}
            size={InputSize.large}
          />
        </FormGroup>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          text="Get Balance"
          onClick={handleGetBalance}
          disabled={loading}
          loading={loading}
        />
        <div className="text-sm flex items-center">
          Balance:{' '}
          <AssetValue
            value={Number(balance)}
            asset={symbol as SupportedTokens}
            useTooltip
            className="ml-1"
          />
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};
