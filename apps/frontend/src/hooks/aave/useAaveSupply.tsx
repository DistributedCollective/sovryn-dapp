import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../config/chains';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { TransactionFactoryOptions } from '../../types/aave';
import { AaveSupplyTransactionsFactory } from '../../utils/aave/AaveSupplyTransactionsFactory';
import { useAccount } from '../useAccount';
import { useNotifyError } from '../useNotifyError';

export const useAaveSupply = () => {
  const { signer } = useAccount();
  const { notifyError } = useNotifyError();
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
      symbol: string,
      opts?: TransactionFactoryOptions,
    ) => {
      try {
        if (!aaveSupplyTransactionsFactory) {
          throw new Error('Transactions factory not available');
        }

        const asset = await getAssetData(symbol, BOB_CHAIN_ID);
        const bnAmount = BigNumber.from(
          amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
        );

        const transactions = await aaveSupplyTransactionsFactory.supply(
          asset,
          bnAmount,
          opts,
        );
        setTransactions(transactions);
        setTitle(t(translations.common.deposit));
        setIsOpen(true);
      } catch (e) {
        notifyError(e);
      }
    },
    [
      setIsOpen,
      setTitle,
      setTransactions,
      aaveSupplyTransactionsFactory,
      notifyError,
    ],
  );

  const handleSwitchCollateral = useCallback(
    async (
      symbol: string,
      useAsCollateral: boolean,
      opts?: TransactionFactoryOptions,
    ) => {
      try {
        if (!aaveSupplyTransactionsFactory) {
          throw new Error('Transactions factory not available');
        }

        const asset = await getAssetData(symbol, BOB_CHAIN_ID);
        const transactions =
          await aaveSupplyTransactionsFactory.collateralSwitch(
            asset,
            useAsCollateral,
            opts,
          );

        setTransactions(transactions);
        setTitle(t(translations.aavePage.tx.toggleAssetAsCollateral));
        setIsOpen(true);
      } catch (e) {
        notifyError(e);
      }
    },
    [
      setIsOpen,
      setTitle,
      setTransactions,
      aaveSupplyTransactionsFactory,
      notifyError,
    ],
  );

  return { handleDeposit, handleSwitchCollateral };
};
