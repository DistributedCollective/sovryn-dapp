import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { AaveWithdrawTransactionsFactory } from '../../utils/aave/AaveWithdrawTransactionsFactory';
import { useAccount } from '../useAccount';

export const useAaveWithdraw = () => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveWithdrawTransactionsFactory = useMemo(() => {
    if (!signer) return null;
    return new AaveWithdrawTransactionsFactory(
      config.PoolAddress,
      config.WETHGatewayAddress,
      signer,
    );
  }, [signer]);

  const handleWithdraw = useCallback(
    async (amount: Decimal, asset: AssetDetailsData) => {
      if (!aaveWithdrawTransactionsFactory) {
        return;
      }
      const bnAmount = BigNumber.from(
        amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
      );

      setTransactions(
        await aaveWithdrawTransactionsFactory.withdraw(asset, bnAmount),
      );
      setTitle(t(translations.common.withdraw));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveWithdrawTransactionsFactory],
  );

  return { handleWithdraw };
};
