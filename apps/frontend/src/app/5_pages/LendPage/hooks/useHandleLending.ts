import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { getTokenDisplayName } from '../../../../constants/tokens';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { LendingPoolDictionary } from '../../../../utils/LendingPoolDictionary';
import { prepareApproveTransaction } from '../../../../utils/transactions';
import { lendingBalanceOf } from '../utils/contract-calls';
import { AssetDetailsData } from '@sovryn/contracts';
import { COMMON_SYMBOLS } from '../../../../utils/asset';

export const useHandleLending = (
  onBegin: () => void,
  onComplete: () => void,
) => {
  const { account, signer } = useAccount();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const handleDeposit = useCallback(
    async (
      amount: Decimal,
      tokenDetails: AssetDetailsData,
      poolTokenContract: Contract,
    ) => {
      if (!account || !signer || !tokenDetails || !poolTokenContract) {
        return;
      }

      const pool = LendingPoolDictionary.pools.get(tokenDetails.symbol);
      const poolUsesLM = pool?.useLM || false;

      const transactions: Transaction[] = [];
      if (!tokenDetails.isNative) {
        const approve = await prepareApproveTransaction({
          token: tokenDetails.symbol,
          amount: amount.toBigNumber().toString(),
          signer,
          spender: poolTokenContract.address,
        });

        if (approve) {
          transactions.push(approve);
        }
      }

      // make sure contract has signer.
      const contract = poolTokenContract.connect(signer);
      const native = tokenDetails.symbol === COMMON_SYMBOLS.BTC;

      transactions.push({
        title: t(translations.lendingTx.deposit, {
          symbol: getTokenDisplayName(tokenDetails.symbol),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: contract,
          fnName: native
            ? 'mintWithBTC(address,bool)'
            : 'mint(address,uint256,bool)',
          args: native
            ? [account, poolUsesLM]
            : [account, amount.toBigNumber().toString(), poolUsesLM],
          value: native ? amount.toBigNumber().toString() : undefined,
          gasLimit: GAS_LIMIT.LENDING_MINT,
        },
        onComplete,
      });

      setTransactions(transactions);
      setTitle(
        t(translations.lendingTx.deposit, {
          symbol: getTokenDisplayName(tokenDetails.symbol),
        }),
      );
      setIsOpen(true);
      onBegin();
    },
    [
      account,
      signer,
      onComplete,
      setTransactions,
      setTitle,
      setIsOpen,
      onBegin,
    ],
  );

  const handleWithdraw = useCallback(
    async (
      amount: Decimal,
      tokenDetails: AssetDetailsData,
      poolTokenContract: Contract,
    ) => {
      if (!account || !signer || !tokenDetails || !poolTokenContract) {
        return;
      }

      const pool = LendingPoolDictionary.pools.get(tokenDetails.symbol);
      const poolUsesLM = pool?.useLM || false;

      // make sure contract has signer.
      const contract = poolTokenContract.connect(signer);

      const transactions: Transaction[] = [];

      // todo: we may need to approve iToken spending if poolUsesLM is false.
      const native = tokenDetails.symbol === COMMON_SYMBOLS.BTC;

      const assetBalance = await asyncCall(
        `poolToken/${poolTokenContract.address}/assetBalanceOf/${account}`,
        () => poolTokenContract.assetBalanceOf(account),
      ).then(Decimal.fromBigNumberString);

      const balance = await lendingBalanceOf(tokenDetails.symbol, account);

      if (amount.gte(assetBalance.sub('0.0000001'))) {
        amount = assetBalance;
      }

      const withdrawAmount = amount.mul(balance.div(assetBalance));

      transactions.push({
        title: t(translations.lendingTx.withdraw, {
          symbol: getTokenDisplayName(tokenDetails.symbol),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: contract,
          fnName: native
            ? 'burnToBTC(address,uint256,bool)'
            : 'burn(address,uint256,bool)',
          args: [account, withdrawAmount.toBigNumber().toString(), poolUsesLM],
          gasLimit: GAS_LIMIT.LENDING_BURN,
        },
        onComplete,
      });

      setTransactions(transactions);
      setTitle(
        t(translations.lendingTx.withdraw, {
          symbol: getTokenDisplayName(tokenDetails.symbol),
        }),
      );
      setIsOpen(true);
      onBegin();
    },
    [
      account,
      onBegin,
      onComplete,
      setIsOpen,
      setTitle,
      setTransactions,
      signer,
    ],
  );

  return {
    handleDeposit,
    handleWithdraw,
  };
};
