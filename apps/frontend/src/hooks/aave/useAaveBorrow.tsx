import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { BorrowRateMode, TransactionFactoryOptions } from '../../types/aave';
import { AaveBorrowTransactionsFactory } from '../../utils/aave/AaveBorrowTransactionsFactory';
import { useAccount } from '../useAccount';

export const useAaveBorrow = () => {
  const { signer } = useAccount();
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
      asset: AssetDetailsData,
      rateMode: BorrowRateMode,
      opts?: TransactionFactoryOptions,
    ) => {
      if (!aaveBorrowTransactionsFactory) {
        return;
      }
      const bnAmount = BigNumber.from(
        amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
      );

      setTransactions(
        await aaveBorrowTransactionsFactory.borrow(
          asset,
          bnAmount,
          rateMode,
          opts,
        ),
      );
      setTitle(t(translations.aavePage.common.borrow));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveBorrowTransactionsFactory],
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

      setTransactions(
        await aaveBorrowTransactionsFactory.swapBorrowRateMode(
          asset,
          currentRateMode,
          opts,
        ),
      );
      setTitle(t(translations.aavePage.tx.swapBorrowRateModeTitle));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveBorrowTransactionsFactory],
  );

  return { handleBorrow, handleSwapBorrowRateMode };
};
