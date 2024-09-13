import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../config/chains';

import { AAVE_CONTRACT_ADDRESSES } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { TransactionFactoryOptions } from '../../types/aave';
import { AaveWithdrawTransactionsFactory } from '../../utils/aave/AaveWithdrawTransactionsFactory';
import { useAccount } from '../useAccount';
import { useNotifyError } from '../useNotifyError';

export const useAaveWithdraw = () => {
  const { signer } = useAccount();
  const { notifyError } = useNotifyError();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveWithdrawTransactionsFactory = useMemo(() => {
    if (!signer) {
      return null;
    }
    return new AaveWithdrawTransactionsFactory(
      AAVE_CONTRACT_ADDRESSES.POOL,
      AAVE_CONTRACT_ADDRESSES.WETH_GATEWAY,
      signer,
    );
  }, [signer]);

  const handleWithdraw = useCallback(
    async (
      amount: Decimal,
      symbol: string,
      isMaxAmount: boolean,
      opts?: TransactionFactoryOptions,
    ) => {
      try {
        if (!aaveWithdrawTransactionsFactory) {
          throw new Error('Transactions factory not available');
        }

        const asset = await getAssetData(symbol, BOB_CHAIN_ID);
        const bnAmount = BigNumber.from(
          amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
        );

        const transactions = await aaveWithdrawTransactionsFactory.withdraw(
          asset,
          bnAmount,
          isMaxAmount,
          opts,
        );

        setTransactions(transactions);
        setTitle(t(translations.common.withdraw));
        setIsOpen(true);
      } catch (e) {
        notifyError(e);
      }
    },
    [
      setIsOpen,
      setTitle,
      setTransactions,
      aaveWithdrawTransactionsFactory,
      notifyError,
    ],
  );

  return { handleWithdraw };
};
