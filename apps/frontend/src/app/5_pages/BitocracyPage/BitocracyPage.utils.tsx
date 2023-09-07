import React from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { Proposal } from '../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../utils/helpers';
import { BLOCK_TIME_IN_SECONDS } from './BitocracyPage.constants';

export const renderEndDate = (item: Proposal) => {
  const secondsBetweenBlocks =
    (item.endBlock - item.startBlock) * BLOCK_TIME_IN_SECONDS;
  const endTime = item.timestamp + secondsBetweenBlocks;

  return dateFormat(endTime);
};

export const generateRowTitle = (item: Proposal) => (
  <Paragraph
    size={ParagraphSize.small}
    className="font-medium truncate max-w-full m-0 pr-4"
  >
    {item.description}
  </Paragraph>
);

export const prettifyId = (item: string) => {
  const id = item.split('-');
  return id[1];
};
