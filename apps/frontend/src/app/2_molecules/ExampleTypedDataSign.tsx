import React, { useCallback } from 'react';

import { providers, utils } from 'ethers';

import { Button } from '@sovryn/ui';

import { useWalletConnect } from '../../hooks';
import { getExampleMessageToSign } from '../../utils/helpers';

export const ExampleTypedDataSign: React.FC = () => {
  const { wallets } = useWalletConnect();

  const signTypedMessage = useCallback(async () => {
    const data = getExampleMessageToSign(parseInt(wallets[0].chains[0].id));

    const signer = new providers.Web3Provider(wallets[0].provider);

    const signature = await signer
      .getSigner()
      ._signTypedData(data.domain, data.types, data.exampleMessage);

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
