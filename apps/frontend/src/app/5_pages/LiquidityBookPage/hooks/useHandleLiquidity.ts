import { useCallback, useMemo } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';
import { getContract, parseUnits } from 'viem';

import { TokenAmount } from '@sovryn/joe-core';
import {
  getUniformDistributionFromBinRange,
  JSBI,
  LBPairV21ABI,
  LBRouterV22ABI,
  LiquidityDistribution,
} from '@sovryn/joe-sdk-v2';

import { BOB_CHAIN_ID } from '../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { prepareApproveTransaction } from '../../../../utils/transactions';
import {
  ALLOWED_SLIPPAGE_AMOUNT,
  LB_ROUTER_CONTRACT,
} from '../LiquidityBookPage.constants';
import { LiquidityBookPool } from '../LiquidityBookPage.types';
import { useBlockchainClients } from '../utils/client';
import { useGetUserOwnedBins } from './useGetUserOwnedBins';

export const useHandleLiquidity = (pool: LiquidityBookPool) => {
  const { account, signer } = useAccount();
  const { publicClient } = useBlockchainClients();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { userOwnedBins, nonZeroAmounts, loading } = useGetUserOwnedBins(pool);

  const currentTimeInSec = useMemo(
    () => Math.floor(new Date().getTime() / 1e3),
    [],
  );

  const deadline = useMemo(() => currentTimeInSec + 3600, [currentTimeInSec]);

  const handleDeposit = useCallback(
    async (
      tokenXAmount: string,
      tokenYAmount: string,
      shape: LiquidityDistribution,
      min: number,
      max: number,
      onComplete: () => void,
    ) => {
      if (!account || !signer) {
        return;
      }

      const tokenXAmountParsed = parseUnits(
        tokenXAmount,
        pool.pair[0].decimals,
      );

      const tokenYAmountParsed = parseUnits(
        tokenYAmount,
        pool.pair[1].decimals,
      );

      const tokenAmountX = new TokenAmount(pool.pair[0], tokenXAmountParsed);
      const tokenAmountY = new TokenAmount(pool.pair[1], tokenYAmountParsed);

      const minTokenAmountX = JSBI.divide(
        JSBI.multiply(
          tokenAmountX.raw,
          JSBI.BigInt(10000 - ALLOWED_SLIPPAGE_AMOUNT),
        ),
        JSBI.BigInt(10000),
      );

      const minTokenAmountY = JSBI.divide(
        JSBI.multiply(
          tokenAmountY.raw,
          JSBI.BigInt(10000 - ALLOWED_SLIPPAGE_AMOUNT),
        ),
        JSBI.BigInt(10000),
      );

      // const { deltaIds, distributionX, distributionY } =
      //   getLiquidityConfig(shape);
      const { deltaIds, distributionX, distributionY } =
        getUniformDistributionFromBinRange(pool.activeBinId, [min, max]);

      const args = [
        {
          tokenX: pool.pair[0].address,
          tokenY: pool.pair[1].address,
          binStep: pool.binStep,
          amountX: tokenAmountX.raw.toString(),
          amountY: tokenAmountY.raw.toString(),
          amountXMin: minTokenAmountX.toString(),
          amountYMin: minTokenAmountY.toString(),
          activeIdDesired: pool.activeBinId,
          idSlippage: 5,
          deltaIds,
          distributionX,
          distributionY,
          to: account,
          refundTo: account,
          deadline: deadline,
        },
      ];

      console.log('args', args);

      const transactions: Transaction[] = [];
      const tokens = [pool.pair[0], pool.pair[1]];
      const tokenAmounts = [
        tokenAmountX.raw.toString(),
        tokenAmountY.raw.toString(),
      ];

      for (const token of tokens) {
        if (!token.isNative) {
          const approve = await prepareApproveTransaction({
            token: String(token.symbol),
            amount: tokenAmounts[tokens.indexOf(token)],
            signer,
            spender: LB_ROUTER_CONTRACT,
            chain: BOB_CHAIN_ID,
          });

          if (approve) {
            transactions.push(approve);
          }
        }
      }

      transactions.push({
        title: t(translations.liquidityBookPage.table.addLiquidity),
        request: {
          type: TransactionType.signTransaction,
          contract: new Contract(LB_ROUTER_CONTRACT, LBRouterV22ABI, signer),
          fnName: 'addLiquidity',
          args: args,
          gasLimit: GAS_LIMIT.TRADING_LIQUIDITY,
        },
        onComplete,
      });

      setTransactions(transactions);
      setTitle(t(translations.liquidityBookPage.table.addLiquidity));
      setIsOpen(true);
    },
    [account, signer, setTransactions, setIsOpen, deadline, setTitle, pool],
  );

  const handleWithdraw = useCallback(
    async (onComplete: () => void) => {
      console.log('pool withdraw', pool);

      if (!account || !signer || loading) {
        return;
      }

      const args = [
        pool.pair[0].address,
        pool.pair[1].address,
        pool.binStep,
        '0',
        '0',
        userOwnedBins,
        nonZeroAmounts,
        account,
        deadline,
      ];

      console.log('args withdraw', args);

      const transactions: Transaction[] = [];
      const poolAddress = pool.contractAddress as `0x${string}`;
      const pairContract = getContract({
        address: poolAddress,
        abi: LBPairV21ABI,
        client: publicClient,
      });

      const isApproved = await publicClient.readContract({
        address: pairContract.address,
        abi: pairContract.abi,
        functionName: 'isApprovedForAll',
        args: [account, LB_ROUTER_CONTRACT],
      });

      if (!isApproved) {
        transactions.push({
          title: t(translations.liquidityBookPage.table.approveForAll),
          request: {
            type: TransactionType.signTransaction,
            contract: new Contract(pool.contractAddress, LBPairV21ABI, signer),
            fnName: 'approveForAll',
            args: [LB_ROUTER_CONTRACT, true],
            gasLimit: GAS_LIMIT.APPROVE,
          },
        });
      }

      transactions.push({
        title: t(translations.liquidityBookPage.table.removeLiquidity),
        request: {
          type: TransactionType.signTransaction,
          contract: new Contract(LB_ROUTER_CONTRACT, LBRouterV22ABI, signer),
          fnName: 'removeLiquidity',
          args: args,
          gasLimit: GAS_LIMIT.TRADING_LIQUIDITY,
        },
        onComplete,
      });

      setTransactions(transactions);
      setTitle(t(translations.liquidityBookPage.table.removeLiquidity));
      setIsOpen(true);
    },
    [
      account,
      signer,
      setTransactions,
      setIsOpen,
      deadline,
      setTitle,
      publicClient,
      pool,
      userOwnedBins,
      nonZeroAmounts,
      loading,
    ],
  );

  return {
    handleDeposit,
    handleWithdraw,
  };
};
