import { useCallback } from 'react';

import { t } from 'i18next';

import { BOB_CHAIN_ID } from '../../../../config/chains';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
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
    if (!claims.length) {
      return [];
    }

    let unclaimedIndexes: number[] = [];

    if (claims.some(c => c.index === 0)) {
      unclaimedIndexes = (
        await Promise.all(
          claims.map(c =>
            contract
              ?.isClaimed(c.index)
              .then(res => (!res ? c.index : null))
              .catch(() => null),
          ),
        )
      ).filter(item => item !== null) as number[];
    } else {
      unclaimedIndexes = (await contract
        ?.getUnclaimed(claims.map(c => c.index))
        .then(res =>
          res.map(item => item.toNumber()).filter(item => item !== 0),
        )
        .catch(() => [])) as number[];
    }

    return claims.filter(c => unclaimedIndexes?.includes(c.index));
  }, [contract, findProofs]);

  const claim = useCallback(async () => {
    if (!signer || chainId !== BOB_CHAIN_ID) {
      return;
    }

    const claims = await getUnclaimed();

    if (!claims.length) {
      return;
    }

    setTransactions([
      {
        title: t(translations.claimLpPage.claimTx.title),
        request: {
          type: TransactionType.signTransaction,
          contract: contract?.connect(signer)!,
          fnName: 'claim',
          args: [
            claims.map(c => c.index),
            claims.map(c => c.token.toLowerCase()),
            account,
            claims.map(c => c.amount),
            claims.map(c => c.proof),
          ],
          gasLimit: 6_000_000,
        },
        onComplete,
      },
    ]);
    setTitle(t(translations.claimLpPage.claimTx.title));
    setIsOpen(true);
  }, [
    account,
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
