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
import { toWei } from '../../../../utils/math';
import { prepareApproveTransaction } from '../../../../utils/transactions';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useHandleMarketMaking = (onComplete: () => void) => {
  const { account, signer } = useAccount();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const btcWrapperProxyContract = useGetProtocolContract('btcWrapperProxy');

  const onDepositV1 = useCallback(
    async (pool: AmmLiquidityPool, amountA: Decimal, amountB: Decimal) => {
      if (!account || !signer || !btcWrapperProxyContract) {
        return;
      }

      const [tokenAContractAddress, tokenBContractAddress] = await Promise.all([
        getTokenContract(pool.assetA, defaultChainId).then(
          item => item.address,
        ),
        getTokenContract(SupportedTokens.wrbtc, defaultChainId).then(
          item => item.address,
        ),
      ]);
      const minReturn = toWei(amountB.toString())
        .sub(toWei(amountB.toString()).div(100))
        .toString();

      const transactions: Transaction[] = [];

      if (pool.assetA !== SupportedTokens.rbtc) {
        const approve = await prepareApproveTransaction({
          token: pool.assetA,
          amount: amountA.toString(),
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
            [tokenBContractAddress, tokenAContractAddress],
            [toWei(amountB.toString()), amountA.toString()],
            minReturn,
          ],
          value: toWei(amountB.toString()),
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

  const onDepositV2 = useCallback(
    async (pool: AmmLiquidityPool, asset: SupportedTokens, amount: Decimal) => {
      if (!account || !signer || !btcWrapperProxyContract) {
        return;
      }

      const token =
        asset === SupportedTokens.rbtc ? SupportedTokens.wrbtc : asset;

      const tokenContract = await getTokenContract(token, defaultChainId);

      const minReturn = '1';

      const transactions: Transaction[] = [];

      if (asset !== SupportedTokens.rbtc) {
        const approve = await prepareApproveTransaction({
          token: asset,
          amount: amount.toString(),
          signer,
          spender: btcWrapperProxyContract.address,
        });

        if (approve) {
          transactions.push(approve);
        }
      }

      transactions.push({
        title: t(translations.marketMakingPage.marketMakingTx.deposit, {
          symbol: getTokenDisplayName(asset),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: btcWrapperProxyContract,
          fnName: 'addLiquidityToV2',
          args: [
            pool.converter,
            tokenContract.address,
            amount.toString(),
            minReturn,
          ],
          value: asset === SupportedTokens.rbtc ? amount.toString() : '0',
          gasLimit: GAS_LIMIT.MARKET_MAKING_ADD_LIQUIDITY,
        },
        onComplete,
      });

      setTransactions(transactions);
      setTitle(
        t(translations.marketMakingPage.marketMakingTx.deposit, {
          symbol: getTokenDisplayName(asset),
        }),
      );
      setIsOpen(true);
    },
    [
      account,
      btcWrapperProxyContract,
      onComplete,
      setIsOpen,
      setTitle,
      setTransactions,
      signer,
    ],
  );

  const onWithdrawV1 = useCallback(
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
          amount: amount.toString(),
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
            poolWeiAmount.toString(),
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

  const onWithdrawV2 = useCallback(
    async (
      pool: AmmLiquidityPool,
      asset: SupportedTokens,
      poolWeiAmount: string,
      amount: Decimal,
      minReturn: string,
    ) => {
      if (!account || !signer || !btcWrapperProxyContract) {
        return;
      }

      const token =
        asset === SupportedTokens.rbtc ? SupportedTokens.wrbtc : asset;

      const tokenContract = await getTokenContract(token, defaultChainId);

      const transactions: Transaction[] = [];

      if (asset !== SupportedTokens.rbtc) {
        const approve = await prepareApproveTransaction({
          token: asset,
          amount: amount.toString(),
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
          fnName: 'removeLiquidityFromV2',
          args: [
            pool.converter,
            tokenContract.address,
            poolWeiAmount.toString(),
            minReturn,
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
    onDepositV1,
    onDepositV2,
    onWithdrawV1,
    onWithdrawV2,
  };
};
