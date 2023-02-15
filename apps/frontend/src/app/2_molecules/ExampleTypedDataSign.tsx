import React, { useCallback } from 'react';

import { utils, ethers } from 'ethers';

import { Button } from '@sovryn/ui';

import { TxType } from '../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { useWalletConnect } from '../../hooks';

export const ExampleTypedDataSign: React.FC = () => {
  const { wallets } = useWalletConnect();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const signTypedMessage = useCallback(async () => {
    const signer = new ethers.providers.Web3Provider(
      wallets[0].provider,
    ).getSigner();

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

    setTransactions([
      {
        title: `Sign typed data`,
        request: {
          type: TxType.signTypedData,
          signer,
          domain: data.domain,
          types: data.types,
          value: data.exampleMessage,
        },
        onComplete: signature => {
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
        },
      },
    ]);
    setTitle('sign data');
    setIsOpen(true);
  }, [setIsOpen, setTitle, setTransactions, wallets]);

  return (
    <Button
      text="Sign a typed data message"
      onClick={signTypedMessage}
      className="ml-4"
    />
  );
};
