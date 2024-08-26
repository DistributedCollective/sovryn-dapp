import { useCallback, useMemo } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { config } from '../../constants/aave';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { AaveRepayTransactionsFactory } from '../../utils/aave/AaveRepayTransactionsFactory';
import { LoanType } from '../../utils/aave/AaveUserReservesSummary';
import { useAccount } from '../useAccount';

export const useAaveRepay = (props: {
  onBegin?: () => void;
  onComplete?: () => void;
}) => {
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
    async (amount: Decimal, asset: AssetDetailsData, loanType: LoanType) => {
      if (!aaveRepayTransactionsFactory) {
        return;
      }
      const bnAmount = BigNumber.from(
        amount.mul(Decimal.from(10).pow(asset.decimals)).toString(),
      );

      setTransactions(
        await aaveRepayTransactionsFactory.repay(asset, bnAmount, loanType),
      );
      setTitle(t(translations.common.buttons.repay));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, aaveRepayTransactionsFactory],
  );

  return { handleRepay };
};
