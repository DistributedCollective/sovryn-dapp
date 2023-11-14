import { useCallback } from 'react';

import { t } from 'i18next';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { getTokenDisplayName } from '../../../../constants/tokens';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { decimalic } from '../../../../utils/math';
import { prepareApproveTransaction } from '../../../../utils/transactions';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useHandleMarketMaking = (onComplete: () => void) => {
  const { account, signer } = useAccount();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const btcWrapperProxyContract = useGetProtocolContract('btcWrapperProxy');

  const onDeposit = useCallback(
    async (pool: AmmLiquidityPool, amountA: Decimal, amountB: Decimal) => {
      if (!account || !signer || !btcWrapperProxyContract) {
        return;
      }

      const [tokenAContract, tokenBContract] = await Promise.all([
        getTokenContract(pool.assetA, defaultChainId).then(
          item => item.address,
        ),
        getTokenContract(SupportedTokens.wrbtc, defaultChainId).then(
          item => item.address,
        ),
      ]);

      const minReturn = amountB.sub(amountB.div(100)).toNumber().toFixed(0);

      const transactions: Transaction[] = [];

      if (pool.assetA !== SupportedTokens.rbtc) {
        const approve = await prepareApproveTransaction({
          token: pool.assetA,
          amount: decimalic(amountA.toString()).toString(),
          signer,
          spender: btcWrapperProxyContract.address,
        });

        if (approve) {
          transactions.push(approve);
        }
      }

      transactions.push({
        title: t(translations.marketMakingPage.marketMakingTx.deposit, {
          symbol: getTokenDisplayName(pool.assetA),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: btcWrapperProxyContract,
          fnName: 'addLiquidityToV1',
          args: [
            pool.converter,
            [tokenBContract, tokenAContract],
            [amountB.toString(), amountA.toString()],
            minReturn,
          ],
          value: amountB.toString(),
          gasLimit: GAS_LIMIT.MARKET_MAKING_ADD_LIQUIDITY,
        },
        onComplete,
      });

      setTransactions(transactions);
      setTitle(
        t(translations.marketMakingPage.marketMakingTx.deposit, {
          symbol: getTokenDisplayName(pool.assetA),
        }),
      );
      setIsOpen(true);
    },
    [
      account,
      signer,
      onComplete,
      setTransactions,
      setTitle,
      setIsOpen,
      btcWrapperProxyContract,
    ],
  );

  const onWithdraw = useCallback(
    async (
      pool: AmmLiquidityPool,
      poolWeiAmount: string,
      amount: Decimal,
      [minReturn1, minReturn2]: [string, string],
    ) => {
      if (!account || !signer || !btcWrapperProxyContract) {
        return;
      }

      const tokenAContractPromise = getTokenContract(
        pool.assetA,
        defaultChainId,
      ).then(item => item.address);
      const tokenBContractPromise = getTokenContract(
        SupportedTokens.wrbtc,
        defaultChainId,
      ).then(item => item.address);

      const [tokenAContract, tokenBContract] = await Promise.all([
        tokenAContractPromise,
        tokenBContractPromise,
      ]);

      const transactions: Transaction[] = [];

      if (pool.assetA !== SupportedTokens.rbtc) {
        const approve = await prepareApproveTransaction({
          token: pool.assetA,
          amount: decimalic(amount.toString()).toString(),
          signer,
          spender: btcWrapperProxyContract.address,
        });

        if (approve) {
          transactions.push(approve);
        }
      }

      transactions.push({
        title: t(translations.marketMakingPage.marketMakingTx.withdraw, {
          symbol: getTokenDisplayName(pool.assetA),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: btcWrapperProxyContract,
          fnName: 'removeLiquidityFromV1',
          args: [
            pool.converter,
            poolWeiAmount,
            [tokenBContract.toLowerCase(), tokenAContract.toLowerCase()],
            [minReturn2, minReturn1],
          ],
          gasLimit: GAS_LIMIT.MARKET_MAKING_REMOVE_LIQUIDITY,
        },
        onComplete,
      });

      setTransactions(transactions);
      setTitle(
        t(translations.marketMakingPage.marketMakingTx.withdraw, {
          symbol: getTokenDisplayName(pool.assetA),
        }),
      );
      setIsOpen(true);
    },
    [
      account,
      signer,
      onComplete,
      setTransactions,
      setTitle,
      setIsOpen,
      btcWrapperProxyContract,
    ],
  );

  return {
    onDeposit,
    onWithdraw,
  };
};
