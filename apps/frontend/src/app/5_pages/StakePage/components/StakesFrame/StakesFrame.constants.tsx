import React from 'react';

import { t } from 'i18next';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../utils/asset';
import { dateFormat, getRskExplorerUrl } from '../../../../../utils/helpers';
import { AdjustStakeRenderer } from '../AdjustStakeRenderer/AdjustStakeRenderer';
import { StakeItem } from './StakesFrame.types';
import { VotingPowerCellRenderer } from './components/VotingPowerCellRenderer';

const rskExplorerUrl = getRskExplorerUrl();

export const COLUMNS_CONFIG = (onSuccess: () => void) => [
  {
    id: 'stakeAmount',
    title: t(translations.stakePage.table.stakeAmount),
    cellRenderer: (item: StakeItem) => (
      <AmountRenderer
        value={item.stakedAmount}
        suffix={findAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
        precision={TOKEN_RENDER_PRECISION}
        showRoundingPrefix
        dataAttribute="stake-amount"
      />
    ),
  },
  {
    id: 'votingPower',
    title: t(translations.stakePage.table.votingPower),
    cellRenderer: (item: StakeItem) => VotingPowerCellRenderer(item),
  },
  {
    id: 'delegate',
    title: t(translations.stakePage.table.delegate),
    cellRenderer: (item: StakeItem) =>
      item.delegate.length ? (
        <TxIdWithNotification
          value={item.delegate}
          href={`${rskExplorerUrl}/address/${item.delegate}`}
        />
      ) : (
        t(translations.common.na)
      ),
  },
  {
    id: 'unlockDate',
    title: t(translations.stakePage.table.endDate),
    cellRenderer: (item: StakeItem) => <>{dateFormat(item.unlockDate)}</>,
  },
  {
    id: 'actions',
    title: ' ',
    cellRenderer: (item: StakeItem) => (
      <AdjustStakeRenderer stake={item} onSuccess={onSuccess} />
    ),
    labelClassName: 'hidden lg:table-cell',
    valueClassName: 'w-full lg:w-auto',
    className: 'flex',
  },
];
