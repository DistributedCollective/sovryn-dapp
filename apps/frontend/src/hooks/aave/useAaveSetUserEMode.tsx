import { useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { AAVE_CONTRACT_ADDRESSES } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { EModeCategory, TransactionFactoryOptions } from '../../types/aave';
import { AaveEModeTransactionsFactory } from '../../utils/aave/AaveEModeTransactionsFactory';
import { useAccount } from '../useAccount';
import { useNotifyError } from '../useNotifyError';

export const useAaveSetUserEMode = () => {
  const { signer } = useAccount();
  const { notifyError } = useNotifyError();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveEModeTransactionsFactory = useMemo(() => {
    if (!signer) {
      return null;
    }

    return new AaveEModeTransactionsFactory(
      AAVE_CONTRACT_ADDRESSES.POOL,
      signer,
    );
  }, [signer]);

  const handleSetUserEMode = useCallback(
    async (category: EModeCategory, opts?: TransactionFactoryOptions) => {
      try {
        if (!aaveEModeTransactionsFactory) {
          throw new Error('Transactions factory not available');
        }

        const transactions = await aaveEModeTransactionsFactory.setUserEMode(
          category,
          opts,
        );
        setTransactions(transactions);
        setTitle(
          t(translations.aavePage.tx.setUserEModeTitle, {
            category: category.label,
          }),
        );
        setIsOpen(true);
      } catch (e) {
        notifyError(e);
      }
    },
    [
      setIsOpen,
      setTitle,
      setTransactions,
      aaveEModeTransactionsFactory,
      notifyError,
    ],
  );

  const handleDisableUserEMode = useCallback(
    async (opts?: TransactionFactoryOptions) => {
      try {
        if (!aaveEModeTransactionsFactory) {
          throw new Error('Transactions factory not available');
        }

        const transactions = await aaveEModeTransactionsFactory.disableEMode(
          opts,
        );
        setTransactions(transactions);
        setTitle(t(translations.aavePage.tx.disableEModeTitle));
        setIsOpen(true);
      } catch (e) {
        notifyError(e);
      }
    },
    [
      aaveEModeTransactionsFactory,
      setIsOpen,
      setTitle,
      setTransactions,
      notifyError,
    ],
  );

  return { handleSetUserEMode, handleDisableUserEMode };
};
