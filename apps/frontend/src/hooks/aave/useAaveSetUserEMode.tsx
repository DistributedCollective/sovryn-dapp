import { useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { EModeCategory, TransactionFactoryOptions } from '../../types/aave';
import { AaveEModeTransactionsFactory } from '../../utils/aave/AaveEModeTransactionsFactory';
import { useAccount } from '../useAccount';

export const useAaveSetUserEMode = () => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveEModeTransactionsFactory = useMemo(() => {
    if (!signer) return null;
    return new AaveEModeTransactionsFactory(config.PoolAddress, signer);
  }, [signer]);

  const handleSetUserEMode = useCallback(
    async (category: EModeCategory, opts?: TransactionFactoryOptions) => {
      if (!aaveEModeTransactionsFactory) {
        return;
      }

      setTransactions(
        await aaveEModeTransactionsFactory.setUserEMode(category, opts),
      );
      setTitle(
        t(translations.aavePage.tx.setUserEModeTitle, {
          category: category.label,
        }),
      );
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveEModeTransactionsFactory],
  );

  const handleDisableUserEMode = useCallback(
    async (opts?: TransactionFactoryOptions) => {
      if (!aaveEModeTransactionsFactory) {
        return;
      }

      setTransactions(await aaveEModeTransactionsFactory.disableEMode(opts));
      setTitle(t(translations.aavePage.tx.disableEModeTitle));
      setIsOpen(true);
    },
    [aaveEModeTransactionsFactory, setIsOpen, setTitle, setTransactions],
  );

  return { handleSetUserEMode, handleDisableUserEMode };
};
