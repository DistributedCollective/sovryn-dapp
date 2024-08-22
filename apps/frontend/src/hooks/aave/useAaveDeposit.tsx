import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { AaveSupplyTransactionsFactory } from '../../utils/aave/AaveSupplyTransactionsFactory';
import { useAccount } from '../useAccount';

export const useAaveDeposit = (onBegin: () => void, onComplete: () => void) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const aaveSupplyTransactionsFactory = useMemo(() => {
    if (!signer) return null;
    return new AaveSupplyTransactionsFactory(
      config.PoolAddress,
      config.WETHGatewayAddress,
      signer,
    );
  }, [signer]);

  const handleDeposit = useCallback(
    async (amount: Decimal, asset: AssetDetailsData) => {
      if (!aaveSupplyTransactionsFactory) {
        return;
      }
      const bnAmount = BigNumber.from(
        amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
      );

      setTransactions(
        await aaveSupplyTransactionsFactory.supply(asset, bnAmount),
      );
      setTitle(t(translations.common.deposit));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveSupplyTransactionsFactory],
  );

  return { handleDeposit };
};
