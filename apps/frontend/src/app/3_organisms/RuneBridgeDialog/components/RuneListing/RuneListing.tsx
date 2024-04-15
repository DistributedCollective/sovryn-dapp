import React, { useMemo } from 'react';

import { Align, RowObject, TableBase, TransactionId } from '@sovryn/ui';

import { Environments, ExplorerNetworkURI } from '../../../../../types/global';
import { useContractService } from '../../hooks/useContractService';
import { RuneExplorerLink } from '../RuneExplorerLink';

const EVM_EXPLORER_BASE_URI =
  process.env.REACT_APP_NETWORK === Environments.Testnet
    ? ExplorerNetworkURI.Testnet
    : ExplorerNetworkURI.Mainnet;

export const RuneListing = () => {
  const { tokenBalances } = useContractService();
  const rows: RowObject[] = useMemo(
    () =>
      tokenBalances.map((tokenBalance, index) => {
        return {
          runeToken: (
            <TransactionId
              href={`${EVM_EXPLORER_BASE_URI}/address/${tokenBalance.tokenContractAddress}`}
              value={tokenBalance.tokenContractAddress}
            />
          ),
          rune: <RuneExplorerLink rune={tokenBalance.name} />,
          balance: `${tokenBalance.balance} ${tokenBalance.symbol}`,
        };
      }),
    [tokenBalances],
  );
  return (
    <div>
      <h1>Rune Listing</h1>
      <div className="mt-2">
        <TableBase
          columns={[
            {
              align: Align.left,
              id: 'rune',
              title: 'Rune',
            },
            {
              align: Align.left,
              id: 'runeToken',
              title: 'Rune Token (RSK)',
            },
            {
              align: Align.left,
              id: 'balance',
              title: 'Token balance (RSK)',
            },
          ]}
          dataAttribute="runeTable"
          onRowClick={() => {}}
          rowKey={row => row.name}
          rows={rows}
        />
      </div>
    </div>
  );
};
