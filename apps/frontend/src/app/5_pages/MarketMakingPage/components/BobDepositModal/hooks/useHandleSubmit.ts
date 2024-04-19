import { MaxAllowanceTransferAmount } from '@uniswap/permit2-sdk';

import { useCallback } from 'react';

import { BigNumber, Contract, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { priceToTick } from '@sovryn/sdex';
import { CrocTokenView } from '@sovryn/sdex/dist/tokens';

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
import { AmbientLiquidityPoolDictionary } from '../../AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
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
    concData,
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

    const pool = AmbientLiquidityPoolDictionary.get(assetA, assetB, chainId);

    // todo: check if tokenA is primary range
    // @dev: It's expected to be TRUE if user enters amount to BASE token input and FALSE if user enters amount to QUOTE token input.
    // @dev: We can have it as TRUE by default.
    // @dev: If liquidity is out of balance and user wants to deposit position which is out of range (max price is lower than current price)  - it MUST be FALSE, to depositing QUOTE token only.
    // @dev: If liquidity is out of balance and user wants to deposit position which is out of range (min price is higher than current price) - it MUST be TRUE, to depositing BASE token only.
    const isTokenAPrimaryRange = !isFinite(concData.base) ? false : true;

    const tick = {
      low: priceToTick(lowerBoundaryPrice),
      high: priceToTick(upperBoundaryPrice),
    };

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
      isTokenAPrimaryRange,
      tick,
      lpConduit: pool?.lpTokenAddress,
    });

    console.log('txData', tx);

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
    assetA,
    assetB,
    chainId,
    concData.base,
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
