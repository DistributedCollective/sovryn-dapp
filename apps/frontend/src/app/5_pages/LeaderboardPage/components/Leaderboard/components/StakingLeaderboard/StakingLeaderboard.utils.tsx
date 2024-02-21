import React from 'react';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { User } from '../../Leaderboard.types';
import { Badges } from '../Badges/Badges';

export const generateRowTitle = (row: User) => (
  <>
    <div className="flex w-full">
      <div className="text-xs font-medium w-9 text-left">{row.rank}</div>
      <div className="w-full">
        <div className="flex items-center justify-between mb-1 text-xs font-medium">
          <div className="mr-4">{prettyTx(row.wallet)}</div>
          <div>
            <AmountRenderer value={row.points} showRoundingPrefix={false} />
          </div>
        </div>
        <div className="flex flex-wrap gap-y-1">
          <Badges user={row} />
        </div>
      </div>
    </div>
  </>
);
