import { MaxAllowanceTransferAmount } from '@uniswap/permit2-sdk';

import { useCallback } from 'react';

import { BigNumber, Contract, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { priceToTick } from '@sovryn/ambient-sdk';
import { CrocTokenView } from '@sovryn/ambient-sdk/dist/tokens';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../locales/i18n';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';
import { createRangePositionTx } from '../../../../BobAmmPage/ambient-utils';
import { useDepositContext } from '../contexts/BobDepositModalContext';
import { useGetPoolInfo } from './useGetPoolInfo';

const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: number,
) => {
  const allowance = await token.allowance(owner);
  const decimals = await token.decimals;

  const needAllowance = parseUnits(
    (amount + 0.00001).toFixed(decimals),
    decimals,
  );

  if (allowance.lt(needAllowance)) {
    const approval = await token.approve();
    return approval;
  }
};

export const useHandleSubmit = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();
  const { account, signer } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPoolInfo(assetA, assetB);
  const {
    minimumPrice: lowerBoundaryPrice,
    maximumPrice: upperBoundaryPrice,
    firstAssetValue,
    secondAssetValue,
    maximumSlippage,
    isBalancedRange,
    rangeWidth,
  } = useDepositContext();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens || !signer) {
      return;
    }

    const transactions: Transaction[] = [];

    const allowanceA = await testAllowance(
      account,
      poolTokens.tokenA,
      Number(firstAssetValue),
    );
    const allowanceB = await testAllowance(
      account,
      poolTokens.tokenB,
      Number(secondAssetValue),
    );

    if (allowanceA) {
      const approve = await prepareApproveTransaction({
        token: poolTokens.tokenA.tokenAddr,
        chain: chainId,
        amount:
          allowanceA.weiQty === ethers.constants.MaxUint256
            ? MaxAllowanceTransferAmount
            : allowanceA.weiQty,
        spender: allowanceA.address,
        contract: new Contract(
          poolTokens.tokenA.tokenAddr,
          (
            await poolTokens.tokenA.context
          ).erc20Write.interface,
          signer,
        ),
      });
      if (approve) {
        transactions.push(approve);
      }
    }

    if (allowanceB) {
      const approve = await prepareApproveTransaction({
        token: poolTokens.tokenB.tokenAddr,
        chain: chainId,
        amount:
          allowanceB.weiQty === ethers.constants.MaxUint256
            ? MaxAllowanceTransferAmount
            : allowanceB.weiQty,
        spender: allowanceB.address,
        contract: new Contract(
          poolTokens.tokenB.tokenAddr,
          (
            await poolTokens.tokenB.context
          ).erc20Write.interface,
          signer,
        ),
      });
      if (approve) {
        transactions.push(approve);
      }
    }

    const tx = await createRangePositionTx({
      crocEnv: croc,
      isAmbient: isBalancedRange && rangeWidth === 100,
      slippageTolerancePercentage: maximumSlippage,
      tokenA: {
        address: poolTokens.tokenA.tokenAddr,
        qty: Number(firstAssetValue),
        isWithdrawFromDexChecked: false,
      },
      tokenB: {
        address: poolTokens.tokenB.tokenAddr,
        qty: Number(secondAssetValue),
        isWithdrawFromDexChecked: false,
      },
      isTokenAPrimaryRange: false,
      tick: {
        low: priceToTick(lowerBoundaryPrice),
        high: priceToTick(upperBoundaryPrice),
      },
    });

    transactions.push({
      title: t(translations.common.deposit),
      request: {
        type: TransactionType.signTransaction,
        contract: tx.contract,
        fnName: 'userCmd',
        args: [tx.path, tx.calldata],
        value: tx.txArgs?.value ? tx.txArgs.value : 0,
        gasLimit: tx.txArgs?.gasLimit
          ? tx.txArgs.gasLimit
          : BigNumber.from(6_000_000),
      },
    });

    setTransactions(transactions);
    setTitle(t(translations.bobMarketMakingPage.depositModal.title));
    setIsOpen(true);
  }, [
    account,
    chainId,
    croc,
    firstAssetValue,
    isBalancedRange,
    lowerBoundaryPrice,
    maximumSlippage,
    poolTokens,
    rangeWidth,
    secondAssetValue,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
    upperBoundaryPrice,
  ]);

  return onSubmit;
};
