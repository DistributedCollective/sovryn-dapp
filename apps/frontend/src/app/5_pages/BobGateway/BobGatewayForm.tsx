import { Token } from '@gobob/bob-sdk/dist/gateway/types';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSendGatewayTransaction,
} from '@gobob/sats-wagmi';

import React, { FC, useEffect, useState } from 'react';

import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { Button, Input, Paragraph, Select } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { useCacheCall } from '../../../hooks';
import { useAccount as useEvmAccount } from '../../../hooks/useAccount';
import { bobGateway } from './BobGateway.utils';

export const BobGatewayForm: FC = () => {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address: btcAddress } = useAccount();
  const { account } = useEvmAccount();
  const { data } = useBalance();
  const {
    data: hash,
    error,
    isPending,
    sendGatewayTransaction,
  } = useSendGatewayTransaction({
    toChain: 'bob-sepolia',
  });

  useEffect(() => {
    bobGateway.getTokens().then(setTokens);
  }, []);

  const onSbumit = async () => {
    const toToken = tokens.find(t => t.address === token);

    if (!account || !amount || !toToken) {
      return;
    }

    const params = {
      toToken: toToken.symbol,
      evmAddress: account,
      value: BigInt(parseUnits(amount, 8).toString()),
    };

    console.log(params);

    sendGatewayTransaction(params, {
      onError: error => console.log({ error }),
    });
  };

  const { value: orders } = useCacheCall(
    `bob-orders/${account}`,
    BOB_CHAIN_ID,
    async () => {
      const result = await bobGateway.getOrders(account);
      return result;
    },
    [account],
    [],
  );

  useEffect(() => {
    console.log({
      error,
      hash,
      isPending,
    });
  }, [error, hash, isPending]);

  useEffect(() => {
    if (orders.length) {
      console.log({
        orders,
      });
    }
  }, [orders]);

  if (!btcAddress) {
    return (
      <div className="flex gap-2 my-4">
        {connectors.map(connector => (
          <Button
            key={connector.name}
            text={connector.name}
            onClick={() => connect({ connector })}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mb-7">
      <br />
      <Paragraph>BTC Wallet: {btcAddress}</Paragraph>
      <br />
      <Button onClick={() => disconnect()} text="Disconnect" />
      <br />
      <br />
      Amount: (Balance: {formatUnits(data?.value.toString() || '0', 8)} BTC)
      <Input
        placeholder="Amount (BTC)"
        step="0.00000001"
        value={amount}
        onChangeText={setAmount}
        className="mb-4"
        type="number"
      />
      <br />
      <Select
        value={token}
        onChange={setToken}
        options={tokens.map(token => ({
          value: token.address,
          label: (
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full"
                src={token.logoURI}
                alt={token.symbol}
              />{' '}
              {token.name} ({token.symbol})
            </div>
          ),
        }))}
        className="min-w-36 w-full lg:w-auto"
      />
      <br />
      <Button loading={isPending} text="submit" onClick={onSbumit} />
    </div>
  );
};
