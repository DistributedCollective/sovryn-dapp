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
    // data: hash,
    // error,
    // isPending,
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
    console.log({
      account,
      amount,
      toToken,
    });

    sendGatewayTransaction(
      {
        toToken: 'tBTC',
        evmAddress: account,
        value: BigInt(parseUnits(amount, 8).toString()),
      },
      {
        onError: error => console.log({ error }),
      },
    );
  };
  // const onSbumit1 = async () => {
  //   const quoteParams: GatewayQuoteParams = {
  //     fromToken: '',
  //     fromChain: 'Bitcoin',
  //     fromUserAddress: 'bc1qafk4yhqvj4wep57m62dgrmutldusqde8adh20d',
  //     toChain: 'bob-sepolia',
  //     toUserAddress: '',
  //     toToken: '', // or "tBTC"
  //     amount: 10000000, // 0.1 BTC
  //     gasRefill: 10000, // 0.0001 BTC
  //   };
  //   // const quoteParams: GatewayQuoteParams = {
  //   //   fromToken: "BTC",
  //   //   fromChain: "Bitcoin",
  //   //   fromUserAddress: "bc1qafk4yhqvj4wep57m62dgrmutldusqde8adh20d",
  //   //   toChain: "BOB",
  //   //   toUserAddress: "0x2D2E86236a5bC1c8a5e5499C517E17Fb88Dbc18c",
  //   //   toToken: "tBTC", // or e.g. "SolvBTC"
  //   //   amount: 10000000, // 0.1 BTC
  //   //   gasRefill: 10000, // 0.0001 BTC. The amount of BTC to swap for ETH for tx fees.
  //   // };

  //   const quote = await bobGateway.getQuote(quoteParams);

  //   const { uuid, psbtBase64 } = await bobGateway.startOrder(
  //     quote,
  //     quoteParams,
  //   );

  //   // NOTE: up to implementation to sign PSBT here!
  //   const tx = Transaction.fromPSBT(base64.decode(psbtBase64!));
  //   // NOTE: relayer broadcasts the tx
  //   await bobGateway.finalizeOrder(uuid, tx.hex);
  // };
  if (!btcAddress) {
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
      <Button text="submit" onClick={onSbumit} />
    </div>
  );
};
