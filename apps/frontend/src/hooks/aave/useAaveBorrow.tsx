import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import {
  AaveBorrowTransactionsFactory,
  BorrowRateMode,
} from '../../utils/aave/AaveBorrowTransactionsFactory';
import { useAccount } from '../useAccount';

export const useAaveBorrow = (props: {
  onBegin?: () => void;
  onComplete?: () => void;
}) => {
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
    ) => {
      if (!aaveBorrowTransactionsFactory) {
        return;
      }
      const bnAmount = BigNumber.from(
        amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
      );

      setTransactions(
        await aaveBorrowTransactionsFactory.borrow(asset, bnAmount, rateMode),
      );
      setTitle(t(translations.aavePage.common.borrow));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveBorrowTransactionsFactory],
  );

  return { handleBorrow };
};
