import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { TransactionFactoryOptions } from '../../types/aave';
import { AaveSupplyTransactionsFactory } from '../../utils/aave/AaveSupplyTransactionsFactory';
import { useAccount } from '../useAccount';

export const useAaveSupply = () => {
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
    async (
      amount: Decimal,
      asset: AssetDetailsData,
      opts?: TransactionFactoryOptions,
    ) => {
      if (!aaveSupplyTransactionsFactory) {
        return;
      }
      const bnAmount = BigNumber.from(
        amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
      );

      setTransactions(
        await aaveSupplyTransactionsFactory.supply(asset, bnAmount, opts),
      );
      setTitle(t(translations.common.deposit));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveSupplyTransactionsFactory],
  );

  const handleSwitchCollateral = useCallback(
    async (
      asset: AssetDetailsData,
      useAsCollateral: boolean,
      opts?: TransactionFactoryOptions,
    ) => {
      if (!aaveSupplyTransactionsFactory) {
        return;
      }

      setTransactions(
        await aaveSupplyTransactionsFactory.collateralSwitch(
          asset,
          useAsCollateral,
          opts,
        ),
      );
      setTitle(t(translations.aavePage.tx.toggleAssetAsCollateral));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveSupplyTransactionsFactory],
  );

  return { handleDeposit, handleSwitchCollateral };
};
