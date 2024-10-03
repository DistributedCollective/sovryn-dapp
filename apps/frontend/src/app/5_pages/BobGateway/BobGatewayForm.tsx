import { GatewayQuoteParams, Token } from '@gobob/bob-sdk/dist/gateway/types';
import { useAccount, useConnect, useDisconnect } from '@gobob/sats-wagmi';
import { base64 } from '@scure/base';
import { Transaction } from '@scure/btc-signer';

import React, { FC, useEffect, useState } from 'react';

import { Button, Input, Paragraph, Select } from '@sovryn/ui';

import { bobGateway } from './BobGateway.utils';

export const BobGatewayForm: FC = () => {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  useEffect(() => {
    bobGateway.getTokens().then(setTokens);
  }, []);

  const onSbumit = async () => {
    const quoteParams: GatewayQuoteParams = {
      fromToken: '',
      fromChain: 'Bitcoin',
      fromUserAddress: 'bc1qafk4yhqvj4wep57m62dgrmutldusqde8adh20d',
      toChain: 'BOB',
      toUserAddress: '',
      toToken: '', // or "tBTC"
      amount: 10000000, // 0.1 BTC
      gasRefill: 10000, // 0.0001 BTC
    };
    const quote = await bobGateway.getQuote(quoteParams);

    const { uuid, psbtBase64 } = await bobGateway.startOrder(
      quote,
      quoteParams,
    );

    // NOTE: up to implementation to sign PSBT here!
    const tx = Transaction.fromPSBT(base64.decode(psbtBase64!));
    // NOTE: relayer broadcasts the tx
    await bobGateway.finalizeOrder(uuid, tx.hex);
  };
  if (!address) {
    return (
      <>
        {connectors.map(connector => (
          <button key={connector.name} onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))}
      </>
    );
  }

  return (
    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mb-7">
      <Paragraph>{address}</Paragraph>
      <button onClick={() => disconnect()}>Disconnect</button>
      Amount:
      <Input value={amount} onChangeText={setAmount} className="my-4" />
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
      <Button text="submit" onClick={onSbumit} />
    </div>
  );
};
