import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../config/chains';

import { AAVE_CONTRACT_ADDRESSES } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { BorrowRateMode, TransactionFactoryOptions } from '../../types/aave';
import { AaveRepayTransactionsFactory } from '../../utils/aave/AaveRepayTransactionsFactory';
import { useAccount } from '../useAccount';
import { useNotifyError } from '../useNotifyError';

export const useAaveRepay = () => {
  const { signer } = useAccount();
  const { notifyError } = useNotifyError();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveRepayTransactionsFactory = useMemo(() => {
    if (!signer) {
      return null;
    }
    return new AaveRepayTransactionsFactory(
      AAVE_CONTRACT_ADDRESSES.POOL,
      AAVE_CONTRACT_ADDRESSES.WETH_GATEWAY,
      signer,
    );
  }, [signer]);

  const handleRepay = useCallback(
    async (
      symbol: string,
      amount: Decimal,
      isEntireDebt: boolean,
      borrowRateMode: BorrowRateMode,
      opts?: TransactionFactoryOptions,
    ) => {
      try {
        if (!aaveRepayTransactionsFactory) {
          throw new Error('Transactions factory not available');
        }

        const asset = await getAssetData(symbol, BOB_CHAIN_ID);
        const bnAmount = BigNumber.from(
          amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
        );

        const transactions = await aaveRepayTransactionsFactory.repay(
          asset,
          bnAmount,
          isEntireDebt,
          borrowRateMode,
          opts,
        );

        setTransactions(transactions);
        setTitle(t(translations.common.buttons.repay));
        setIsOpen(true);
      } catch (e) {
        notifyError(e);
      }
    },
    [
      setIsOpen,
      setTitle,
      setTransactions,
      aaveRepayTransactionsFactory,
      notifyError,
    ],
  );

  return { handleRepay };
};
