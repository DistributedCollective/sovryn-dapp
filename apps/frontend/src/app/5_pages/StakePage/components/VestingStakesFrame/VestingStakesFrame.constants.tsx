import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonSize, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { VestingContract } from '../../../../../utils/graphql/rsk/generated';

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
    cellRenderer: () => '-',
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
          dataAttribute="vesting-stakes-adjust-button"
          className="md:w-auto w-full"
        />
      </div>
    ),
  },
];
