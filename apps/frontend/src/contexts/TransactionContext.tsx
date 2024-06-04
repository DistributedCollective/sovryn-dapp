import React, { createContext, useContext, useState } from 'react';

import { Transaction } from '../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';

interface TransactionContextInterface {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  isOpen: boolean;
  setIsOpen: (txDialog: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  txTrigger: string;
  setTxTrigger: (title: string) => void;
}

export const defaultValue: TransactionContextInterface = {
  transactions: [],
  setTransactions: () => {},
  isOpen: false,
  setIsOpen: () => {},
  title: '',
  setTitle: () => {},
  txTrigger: '',
  setTxTrigger: () => {},
};
export const TransactionContext =
  createContext<TransactionContextInterface>(defaultValue);

export const useTransactionContext = () => {
  return useContext(TransactionContext) as TransactionContextInterface;
};

interface Props {
  children?: React.ReactNode;
}

export const TransactionProvider: React.FC<Props> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [txTrigger, setTxTrigger] = useState('');

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        isOpen,
        setIsOpen,
        title,
        setTitle,
        txTrigger,
        setTxTrigger,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
