import React, { FC, useState } from 'react';

import { Tabs } from '@sovryn/ui';

import { TAB_ITEMS } from './Leaderboard.constants';

export const Leaderboard: FC = () => {
  const [index, setIndex] = useState(0);

  return (
    <Tabs
      index={index}
      items={TAB_ITEMS}
      onChange={setIndex}
      className="w-full mt-12"
    />
  );
};
