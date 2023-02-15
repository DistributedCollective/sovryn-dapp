import React, { useCallback } from 'react';

import { utils } from 'ethers';

import { Button } from '@sovryn/ui';

import { TransactionType } from '../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { useWalletConnect } from '../../hooks';
import { useAccount } from '../../hooks/useAccount';

export const ExampleTypedDataSign: React.FC = () => {
  const { wallets } = useWalletConnect();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { signer, account } = useAccount();

  const signTypedMessage = useCallback(async () => {
    if (!signer) {
      return;
    }

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
          type: TransactionType.signTypedData,
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
            account.toLowerCase() === signerVerification.toLowerCase()
              ? 'Signature verified'
              : 'Signature verification failed',
          );
        },
      },
    ]);
    setTitle('sign data');
    setIsOpen(true);
  }, [account, setIsOpen, setTitle, setTransactions, signer, wallets]);

  return (
    <Button
      text="Sign a typed data message"
      onClick={signTypedMessage}
      className="ml-4"
    />
  );
};
