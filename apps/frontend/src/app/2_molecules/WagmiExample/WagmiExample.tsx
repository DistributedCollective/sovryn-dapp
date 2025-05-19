import React, { FC } from 'react';

import { Button } from '@sovryn/ui';
import {
  useConnect,
  useAccount,
  useDisconnect,
  useSendTransaction,
  parseEther,
} from '@sovryn/wagmi-wrapper';

export const WagmiExample: FC = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending, isSuccess, isError } =
    useSendTransaction();

  const handleSendTransaction = async () => {
    await sendTransaction({
      to: '0x0000000000000000000000000000000000000000',
      value: parseEther('0.00001'),
    });
  };

  if (isConnected) {
    return (
      <div className="flex flex-col gap-4 items-start">
        <p>Connected to: {address}</p>
        <Button onClick={() => disconnect()} text="Disconnect"></Button>
        <Button
          onClick={handleSendTransaction}
          text="Send 0.00001 ETH"
        ></Button>

        {isPending && <p>Transaction pending...</p>}
        {isSuccess && <p>Transaction successful!</p>}
        {isError && <p>Error sending transaction</p>}
      </div>
    );
  }

  return (
    <div>
      {connectors.map(connector => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          text={`Connect with ${connector.name}`}
        ></Button>
      ))}
    </div>
  );
};
