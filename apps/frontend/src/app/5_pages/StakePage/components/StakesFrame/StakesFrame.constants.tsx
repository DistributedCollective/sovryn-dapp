import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { StakingType } from './StakesFrame.types';
import { VotingPowerCellRenderer } from './components/VotingPowerCellRenderer';

export const COLUMNS_CONFIG = [
  {
    id: 'stakeAmount',
    title: t(translations.stakePage.table.stakeAmount),
    cellRenderer: (item: StakingType) => (
      <AmountRenderer
        value={item.amount}
        suffix={SupportedTokens.sov}
        precision={TOKEN_RENDER_PRECISION}
        showRoundingPrefix
        dataAttribute="stake-amount"
      />
    ),
  },
  {
    id: 'votingPower',
    title: t(translations.stakePage.table.votingPower),
    cellRenderer: (item: StakingType) => VotingPowerCellRenderer(item),
  },
  {
    id: 'delegate',
    title: t(translations.stakePage.table.delegate),
    cellRenderer: () => t(translations.common.na),
  },
  {
    id: 'lockedUntil',
    title: t(translations.stakePage.table.endDate),
    cellRenderer: (item: StakingType) => <>{dateFormat(item.lockedUntil)}</>,
  },
  {
    id: 'actions',
    title: ' ',
    cellRenderer: () => (
      <div className="flex justify-end">
        <Button
          style={ButtonStyle.secondary}
          size={ButtonSize.small}
          text={t(translations.stakePage.table.adjustButton)}
          onClick={() => {}}
          dataAttribute="stakes-adjust-button"
        />
      </div>
    ),
  },
];
