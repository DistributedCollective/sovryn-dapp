import React from 'react';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { User, UserBadges } from '../../Leaderboard.types';
import { Badges } from '../Badges/Badges';

export const parseBadges = (data: any): UserBadges[] => {
  let badges: UserBadges[] = [];

  if (data.early_user === 1) {
    badges.push(UserBadges.EARLY_USER);
  }

  if (data.genesis === 1) {
    badges.push(UserBadges.GENESIS);
  }

  if (data.origin === 1) {
    badges.push(UserBadges.ORIGIN);
  }

  if (data.nft === 1) {
    badges.push(UserBadges.NFT);
  }

  if (data.top_importer_day === 1) {
    badges.push(UserBadges.TOP_IMPORTER_DAY);
  }

  if (data.top_importer_week === 1) {
    badges.push(UserBadges.TOP_IMPORTER_WEEK);
  }

  if (data.voter === 1) {
    badges.push(UserBadges.VOTER);
  }

  if (data.top_staker_day === 1) {
    badges.push(UserBadges.TOP_STAKER_DAY);
  }

  if (data.top_staker_week === 1) {
    badges.push(UserBadges.TOP_STAKER_WEEK);
  }

  return badges;
};

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
