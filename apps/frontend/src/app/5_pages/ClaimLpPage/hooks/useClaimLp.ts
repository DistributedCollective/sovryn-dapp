import { useCallback } from 'react';

import { t } from 'i18next';

import { NotificationType } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../config/chains';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useNotificationContext } from '../../../../contexts/NotificationContext';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { isMainnet } from '../../../../utils/helpers';

export type Claim = {
  index: number;
  token: string;
  account: string;
  amount: string;
  proof: string[];
};

export type Proof = {
  merkleRoot: string;
  claims: Claim[];
};

export const useClaimLp = (onComplete?: () => void) => {
  const chainId = useCurrentChain();
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { addNotification } = useNotificationContext();

  const contract = useGetProtocolContract('merkleDistributor', BOB_CHAIN_ID);

  const findProofs = useCallback(async () => {
    const proof: Proof = isMainnet()
      ? await import('../data/proof.mainnet.json').then(res => res.default)
      : await import('../data/proof.testnet.json').then(res => res.default);

    return {
      merkleRoot: proof.merkleRoot,
      claims: proof.claims.filter(
        c => c.account.toLowerCase() === account.toLowerCase(),
      ),
    };
  }, [account]);

  const getTokens = useCallback(async () => {
    const { claims } = await findProofs();
    return claims.map(c => ({ token: c.token, amount: c.amount }));
  }, [findProofs]);

  const getUnclaimed = useCallback(async (): Promise<Claim[]> => {
    const { claims } = await findProofs();
    const unclaimedIndexes = contract
      ?.contract(signer)
      .getUnclaimed(claims.map(c => c.index));
    return claims.filter(c => unclaimedIndexes.includes(c.index));
  }, [contract, findProofs, signer]);

  const claim = useCallback(async () => {
    if (chainId !== BOB_CHAIN_ID) {
      return addNotification({
        id: 'claim-lp',
        title: 'wrong network',
        type: NotificationType.error,
      });
    }

    const claims = await getUnclaimed();

    if (!claims.length) {
      return addNotification({
        id: 'claim-lp',
        title: 'no claims',
        type: NotificationType.error,
      });
    }

    setTransactions([
      {
        title: t(translations.claimLpPage.claimTx.title),
        request: {
          type: TransactionType.signTransaction,
          contract: contract?.contract(signer),
          fnName: 'claim',
          args: [
            claims.map(c => c.index),
            claims.map(c => c.token.toLowerCase()),
            account,
            claims.map(c => c.amount),
            claims.map(c => c.proof),
          ],
        },
        onComplete,
      },
    ]);
    setTitle(t(translations.claimLpPage.claimTx.title));
    setIsOpen(true);
  }, [
    account,
    addNotification,
    chainId,
    contract,
    getUnclaimed,
    onComplete,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
  ]);

  return {
    getTokens,
    getUnclaimed,
    claim,
  };
};
