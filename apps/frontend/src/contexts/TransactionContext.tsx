import React, { createContext, useContext, useState } from 'react';

import { TokenBalance } from '../app/3_organisms/RuneBridgeDialog/contexts/contract';
import { Transaction } from '../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';

interface TransactionContextInterface {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  runeBridgeTransactions: Transaction[];
  setRuneBridgeTransactions: (transactions: Transaction[]) => void;
  runeBridgeIsOpen: boolean;
  setRuneBridgeIsOpen: (txDialog: boolean) => void;
  isOpen: boolean;
  setIsOpen: (txDialog: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  runeBridgeToken: TokenBalance;
  setRuneBridgeToken: (token: TokenBalance) => void;
}

export const defaultValue: TransactionContextInterface = {
  transactions: [],
  setTransactions: () => {},
  runeBridgeTransactions: [],
  setRuneBridgeTransactions: () => {},
  runeBridgeIsOpen: false,
  setRuneBridgeIsOpen: () => {},
  isOpen: false,
  setIsOpen: () => {},
  title: '',
  setTitle: () => {},
  runeBridgeToken: {
    symbol: '',
    balance: '',
    decimals: 18,
    name: '',
    tokenContractAddress: '',
  },
  setRuneBridgeToken: () => {},
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
  const [runeBridgeTransactions, setRuneBridgeTransactions] = useState<
    Transaction[]
  >([]);
  const [runeBridgeIsOpen, setRuneBridgeIsOpen] = useState(false);
  const [runeBridgeToken, setRuneBridgeToken] = useState<TokenBalance>({
    balance: '',
    name: '',
    decimals: 18,
    symbol: '',
    tokenContractAddress: '',
  });

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        runeBridgeTransactions,
        setRuneBridgeTransactions,
        runeBridgeIsOpen,
        setRuneBridgeIsOpen,
        isOpen,
        setIsOpen,
        title,
        setTitle,
        runeBridgeToken,
        setRuneBridgeToken,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
