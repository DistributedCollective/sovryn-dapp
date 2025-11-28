import React, { FC } from 'react';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  HeadingType,
  Paragraph,
  ParagraphSize,
  Dialog,
} from '@sovryn/ui';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { RawTransaction } from '../types';

interface TransactionConfirmModalProps {
  transactions: RawTransaction[];
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionConfirmModal: FC<TransactionConfirmModalProps> = ({
  transactions,
  isOpen,
  onClose,
}) => {
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { signer } = useAccount();

  const handleConfirm = () => {
    if (!signer || transactions.length === 0) return;

    // Convert RawTransactions to Transaction format for TransactionContext
    const txs = transactions.map((tx, index) => ({
      title: tx.description || `Transaction ${index + 1}`,
      request: {
        type: TransactionType.signTransactionData as const, // Use as const to ensure literal type
        signer: signer,
        to: tx.to,
        data: tx.data,
        value: tx.value || '0',
        gasLimit: tx.gasLimit || GAS_LIMIT.CONVERT,
      },
      onComplete: () => {},
    }));

    setTransactions(txs);
    setTitle('Sign Agent Transactions');
    setIsOpen(true);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-90 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <Heading type={HeadingType.h2} className="mb-4">
          Confirm Transactions
        </Heading>

        <Paragraph size={ParagraphSize.base} className="mb-6 text-gray-30">
          The agent has prepared {transactions.length} transaction
          {transactions.length > 1 ? 's' : ''} for you to sign. Please review
          the details below.
        </Paragraph>

        <div className="space-y-4 mb-6">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="bg-gray-80 p-4 border border-gray-70 rounded"
            >
              <Heading type={HeadingType.h3} className="mb-3 text-primary-10">
                {index + 1}. {tx.description || `Transaction ${index + 1}`}
              </Heading>

              <div className="space-y-2">
                <div>
                  <Paragraph
                    size={ParagraphSize.small}
                    className="text-gray-50"
                  >
                    To:
                  </Paragraph>
                  <Paragraph
                    size={ParagraphSize.small}
                    className="font-mono break-all text-xs"
                  >
                    {tx.to}
                  </Paragraph>
                </div>

                {tx.value && tx.value !== '0' && (
                  <div>
                    <Paragraph
                      size={ParagraphSize.small}
                      className="text-gray-50"
                    >
                      Value:
                    </Paragraph>
                    <Paragraph size={ParagraphSize.small} className="font-mono">
                      {tx.value}
                    </Paragraph>
                  </div>
                )}

                <div>
                  <Paragraph
                    size={ParagraphSize.small}
                    className="text-gray-50"
                  >
                    Data:
                  </Paragraph>
                  <Paragraph
                    size={ParagraphSize.small}
                    className="font-mono break-all line-clamp-2 text-xs text-gray-40"
                  >
                    {tx.data}
                  </Paragraph>
                </div>

                {tx.gasLimit && (
                  <div>
                    <Paragraph
                      size={ParagraphSize.small}
                      className="text-gray-50"
                    >
                      Gas Limit:
                    </Paragraph>
                    <Paragraph size={ParagraphSize.small} className="font-mono">
                      {tx.gasLimit}
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            text="Cancel"
            onClick={onClose}
            style={ButtonStyle.secondary}
            type={ButtonType.button}
            className="flex-1"
          />
          <Button
            text="Confirm & Sign"
            onClick={handleConfirm}
            style={ButtonStyle.primary}
            type={ButtonType.button}
            className="flex-1"
            disabled={!signer}
          />
        </div>

        {!signer && (
          <Paragraph
            size={ParagraphSize.small}
            className="text-warning text-center mt-3"
          >
            Please connect your wallet to sign transactions.
          </Paragraph>
        )}
      </div>
    </Dialog>
  );
};
