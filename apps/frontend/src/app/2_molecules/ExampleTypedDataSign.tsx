import React, { useCallback } from 'react';

import { utils } from 'ethers';

import { Button } from '@sovryn/ui';

import { useWalletConnect } from '../../hooks';
import { signTypedData } from '../../utils/helpers';

export const ExampleTypedDataSign: React.FC = () => {
  const { wallets } = useWalletConnect();

  const signTypedMessage = useCallback(async () => {
    const data = {
      domain: {
        chainId: parseInt(wallets[0].chains[0].id),
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },

      exampleMessage: {
        content: 'an example message',
      },

      types: {
        exampleMessage: [{ name: 'content', type: 'string' }],
      },
    };

    const signature = await signTypedData(
      wallets[0].provider,
      data.domain,
      data.types,
      data.exampleMessage,
    );

    const signerVerification = utils.verifyTypedData(
      data.domain,
      data.types,
      data.exampleMessage,
      signature,
    );

    alert(
      wallets[0]?.accounts[0]?.address.toLowerCase() ===
        signerVerification.toLowerCase()
        ? 'Signature verified'
        : 'Signature verification failed',
    );
  }, [wallets]);

  return (
    <Button
      text="Sign a typed data message"
      onClick={signTypedMessage}
      className="ml-4"
    />
  );
};
