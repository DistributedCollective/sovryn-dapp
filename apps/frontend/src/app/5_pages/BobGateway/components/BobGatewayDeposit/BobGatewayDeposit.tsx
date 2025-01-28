import { Token } from '@gobob/bob-sdk/dist/gateway/types';
import {
  useAccount,
  useBalance,
  useSendGatewayTransaction,
} from '@gobob/sats-wagmi';

import React, { FC, useEffect, useState } from 'react';

import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { Button, Input, Paragraph, Select } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { useCacheCall } from '../../../../../hooks';
import { useAccount as useEvmAccount } from '../../../../../hooks/useAccount';
import { bobGateway } from '../../BobGateway.utils';

export const BobGatewayDeposit: FC = () => {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const { address: btcAddress } = useAccount();
  const { account } = useEvmAccount();
  const { data } = useBalance();
  const {
    data: hash,
    error,
    isPending,
    sendGatewayTransaction,
  } = useSendGatewayTransaction({
    toChain: 'bob',
    strategyAddress: '0xBA67A0a0C2dd790182D1954B4C9788f9Ae43e604',
  });

  useEffect(() => {
    if (!tokens.length) {
      bobGateway.getTokens().then(list => {
        console.log(list);
        setTokens(list);
      });
    }
  }, [tokens.length]);

  const onSbumit = async () => {
    const toToken = tokens.find(t => t.address === token);

    if (!account || !amount || !toToken) {
      return;
    }

    const params = {
      toToken: 'uniBTC',
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

  return (
    <div>
      <Paragraph>BTC Wallet: {btcAddress}</Paragraph>
      Amount: (Balance: {formatUnits(data?.total.toString() || '0', 8)} BTC)
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
      <Button loading={isPending} text="submit" onClick={onSbumit} />
    </div>
  );
};
