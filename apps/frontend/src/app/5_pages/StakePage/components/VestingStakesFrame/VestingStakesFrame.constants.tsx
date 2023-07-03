import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { VestingContract } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const COLUMNS_CONFIG = [
  {
    id: 'stakeAmount',
    title: t(translations.stakePage.table.stakeAmount),
    cellRenderer: (item: VestingContract) => (
      <AmountRenderer
        value={item.currentBalance}
        suffix={SupportedTokens.sov}
        precision={TOKEN_RENDER_PRECISION}
        showRoundingPrefix
        dataAttribute="vesting-stakes-amount"
      />
    ),
  },
  {
    id: 'votingPower',
    title: t(translations.stakePage.table.votingPower),
    cellRenderer: () => '-',
  },
  {
    id: 'delegate',
    title: t(translations.stakePage.table.delegate),
    cellRenderer: () => t(translations.common.na),
  },
  {
    id: 'createdAtTimestamp',
    title: t(translations.stakePage.table.endDate),
    cellRenderer: (item: VestingContract) => (
      <>{dateFormat(item.createdAtTimestamp)}</>
    ),
  },
];
