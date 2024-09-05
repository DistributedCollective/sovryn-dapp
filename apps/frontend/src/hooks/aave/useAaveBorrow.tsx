import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData, getAssetData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../config/chains';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { BorrowRateMode, TransactionFactoryOptions } from '../../types/aave';
import { AaveBorrowTransactionsFactory } from '../../utils/aave/AaveBorrowTransactionsFactory';
import { useAccount } from '../useAccount';
import { useNotifyError } from '../useNotifyError';

export const useAaveBorrow = () => {
  const { signer } = useAccount();
  const { notifyError } = useNotifyError();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveBorrowTransactionsFactory = useMemo(() => {
    if (!signer) return null;
    return new AaveBorrowTransactionsFactory(
      config.PoolAddress,
      config.WETHGatewayAddress,
      config.VariableDebtWETHAddress,
      signer,
    );
  }, [signer]);

  const handleBorrow = useCallback(
    async (
      amount: Decimal,
      symbol: string,
      rateMode: BorrowRateMode,
      opts?: TransactionFactoryOptions,
    ) => {
      try {
        if (!aaveBorrowTransactionsFactory) {
          throw new Error('Transactions factory not available');
        }

        const asset = await getAssetData(symbol, BOB_CHAIN_ID);
        const bnAmount = BigNumber.from(
          amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
        );

        const transactions = await aaveBorrowTransactionsFactory.borrow(
          asset,
          bnAmount,
          rateMode,
          opts,
        );

        setTransactions(transactions);
        setTitle(t(translations.aavePage.common.borrow));
        setIsOpen(true);
      } catch (e) {
        notifyError(e);
      }
    },
    [
      setIsOpen,
      setTitle,
      setTransactions,
      aaveBorrowTransactionsFactory,
      notifyError,
    ],
  );

  const handleSwapBorrowRateMode = useCallback(
    async (
      asset: AssetDetailsData,
      currentRateMode: BorrowRateMode,
      opts?: TransactionFactoryOptions,
    ) => {
      if (!aaveBorrowTransactionsFactory) {
        return;
      }

      aaveBorrowTransactionsFactory
        .swapBorrowRateMode(asset, currentRateMode, opts)
        .then(transactions => {
          setTransactions(transactions);
          setTitle(t(translations.aavePage.tx.swapBorrowRateModeTitle));
          setIsOpen(true);
        })
        .catch(notifyError);
    },
    [
      setIsOpen,
      setTitle,
      setTransactions,
      aaveBorrowTransactionsFactory,
      notifyError,
    ],
  );

  return { handleBorrow, handleSwapBorrowRateMode };
};
