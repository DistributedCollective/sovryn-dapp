import React, { FC, useCallback } from 'react';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  HeadingType,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { RawTransaction } from '../types';

interface TransactionActionCardProps {
  transaction: RawTransaction;
}

export const TransactionActionCard: FC<TransactionActionCardProps> = ({
  transaction,
}) => {
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { signer } = useAccount();

  const handleSign = useCallback(() => {
    if (!signer) return;

    setTransactions([
      {
        title: 'Execute Agent Transaction',
        request: {
          type: TransactionType.signTransactionData,
          signer: signer,
          to: transaction.to,
          data: transaction.data,
          value: transaction.value || '0',
          gasLimit: transaction.gasLimit || GAS_LIMIT.CONVERT, // Use gasLimit from backend if available
        },
        onComplete: hash => {
          console.log('Transaction completed:', hash);
        },
      },
    ]);
    setTitle('Sign Transaction');
    setIsOpen(true);
  }, [signer, transaction, setTransactions, setIsOpen, setTitle]);

  return (
    <div className="bg-gray-80 p-4 border border-gray-70 rounded">
      <Heading type={HeadingType.h3} className="mb-2 text-primary-10">
        {transaction.description || 'Proposed Transaction'}
      </Heading>
      <div className="space-y-2 mb-4">
        <div>
          <Paragraph size={ParagraphSize.small} className="text-gray-50">
            To:
          </Paragraph>
          <Paragraph size={ParagraphSize.small} className="font-mono break-all">
            {transaction.to}
          </Paragraph>
        </div>
        {transaction.value && (
          <div>
            <Paragraph size={ParagraphSize.small} className="text-gray-50">
              Value:
            </Paragraph>
            <Paragraph size={ParagraphSize.small} className="font-mono">
              {transaction.value}
            </Paragraph>
          </div>
        )}
        <div>
          <Paragraph size={ParagraphSize.small} className="text-gray-50">
            Data:
          </Paragraph>
          <Paragraph
            size={ParagraphSize.small}
            className="font-mono break-all line-clamp-3 text-xs text-gray-40"
          >
            {transaction.data}
          </Paragraph>
        </div>
      </div>
      <Button
        text="Sign & Send"
        onClick={handleSign}
        style={ButtonStyle.secondary}
        type={ButtonType.button}
        className="w-full"
        disabled={!signer}
      />
      {!signer && (
        <Paragraph
          size={ParagraphSize.small}
          className="text-warning text-center mt-2"
        >
          Please connect your wallet to sign.
        </Paragraph>
      )}
    </div>
  );
};
