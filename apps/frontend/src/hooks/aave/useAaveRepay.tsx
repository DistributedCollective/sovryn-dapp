import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { BorrowRateMode, TransactionFactoryOptions } from '../../types/aave';
import { AaveRepayTransactionsFactory } from '../../utils/aave/AaveRepayTransactionsFactory';
import { useAccount } from '../useAccount';

export const useAaveRepay = () => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveRepayTransactionsFactory = useMemo(() => {
    if (!signer) return null;
    return new AaveRepayTransactionsFactory(
      config.PoolAddress,
      config.WETHGatewayAddress,
      signer,
    );
  }, [signer]);

  const handleRepay = useCallback(
    async (
      amount: Decimal,
      asset: AssetDetailsData,
      borrowRateMode: BorrowRateMode,
      opts?: TransactionFactoryOptions,
    ) => {
      if (!aaveRepayTransactionsFactory) {
        return;
      }
      const bnAmount = BigNumber.from(
        amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
      );

      setTransactions(
        await aaveRepayTransactionsFactory.repay(
          asset,
          bnAmount,
          borrowRateMode,
          opts,
        ),
      );
      setTitle(t(translations.common.buttons.repay));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveRepayTransactionsFactory],
  );

  return { handleRepay };
};
