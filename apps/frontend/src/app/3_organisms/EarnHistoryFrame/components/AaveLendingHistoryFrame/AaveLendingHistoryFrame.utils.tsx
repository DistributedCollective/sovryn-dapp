import React from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { dateFormat } from '../../../../../utils/helpers';
import { LendingHistoryItem } from './AaveLendingHistoryFrame.types';

export const generateRowTitle = (
  item: LendingHistoryItem,
  isOpen?: boolean,
) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {item.action}
    {' - '}
    {dateFormat(Number(item.timestamp))}
  </Paragraph>
);
