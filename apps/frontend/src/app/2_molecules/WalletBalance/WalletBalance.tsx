import React, { FC, useMemo } from 'react';

import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import styles from './WalletBalance.module.css';

export const WalletBalance: FC = () => {
  const tokenOptions = useMemo(() => {
    return SupportedTokenList.map(token => (
      <SimpleTableRow
        className={styles.row}
        key={token.symbol}
        label={token.symbol}
        value="0" //TODO get balance from the wallet, task SOV-1101
      />
      //TODO: hardcoded, need to remove filter once we have a full list of tokens and ask Gilad to provide token symbols
    )).filter(token => token.props.label !== SupportedTokens.sov);
  }, []);

  return (
    <SimpleTable children={tokenOptions} className={styles.walletBalance} />
  );
};
