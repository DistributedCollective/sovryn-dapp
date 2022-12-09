import React, { FC, useEffect, useMemo, useState } from 'react';

import { constants, Contract } from 'ethers';
import { commify } from 'ethers/lib/utils';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { ChainId, getProvider } from '@sovryn/ethers-provider';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { useWalletConnect } from '../../../hooks';
import { useIsMounted } from '../../../hooks/useIsMounted';
import { asyncCall, idHash } from '../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../utils/chain';
import { fromWeiFixed } from '../../../utils/math';
import styles from './WalletBalance.module.css';

const tokensToDisplay = [
  SupportedTokens.rbtc,
  SupportedTokens.zusd,
  SupportedTokens.xusd,
  SupportedTokens.dllr,
];

const getBalances = async (account: string, chainId: ChainId) => {
  return await Promise.all(
    tokensToDisplay.map(token => getBalance(account, token, chainId)),
  );
};

const getBalance = async (
  account: string,
  asset: SupportedTokens,
  chainId: ChainId,
) => {
  try {
    const tokenDetails = await getTokenDetails(asset, chainId);
    const hashedArgs = idHash([
      tokenDetails.address,
      tokenDetails.address === constants.AddressZero
        ? 'nativeBalance'
        : 'balanceOf',
      account,
    ]);

    const callback =
      tokenDetails.address === constants.AddressZero
        ? () =>
            getProvider(chainId)
              .getBalance(account)
              .then(result => result.toString())
        : () =>
            new Contract(
              tokenDetails.address,
              tokenDetails.abi,
              getProvider(chainId),
            )
              .balanceOf(account)
              .then(result => result.toString());

    return await asyncCall<string>(hashedArgs, callback, {
      ttl: 1000 * 30,
      fallbackToPreviousResult: true,
    });
  } catch (e) {
    return '0';
  }
};

export const WalletBalance: FC = () => {
  const isMounted = useIsMounted();
  const { account } = useWalletConnect();

  const [balances, setBalances] = useState<string[]>([]);

  useEffect(() => {
    if (!isMounted() && account) {
      return;
    }

    getBalances(account, getRskChainId())
      .then(setBalances)
      .catch(() => setBalances([]));
  }, [account, isMounted]);

  const tokenOptions = useMemo(
    () =>
      tokensToDisplay.map(token => (
        <SimpleTableRow
          className={styles.row}
          key={token}
          label={token}
          value={commify(
            fromWeiFixed(balances[tokensToDisplay.indexOf(token)] || '0', 6),
          )}
        />
      )),
    [balances],
  );

  return (
    <SimpleTable children={tokenOptions} className={styles.walletBalance} />
  );
};
