import React, { Dispatch, FC, RefObject, SetStateAction } from 'react';

import { Tabs } from '@sovryn/ui';

import { TAB_ITEMS } from './Leaderboard.constants';

type LeaderboardProps = {
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  tableRef: RefObject<HTMLDivElement>;
};

export const Leaderboard: FC<LeaderboardProps> = ({
  index,
  setIndex,
  tableRef,
}) => (
  <Tabs
    index={index}
    items={TAB_ITEMS}
    onChange={setIndex}
    className="w-full mt-12"
    wrapperRef={tableRef}
  />
);
