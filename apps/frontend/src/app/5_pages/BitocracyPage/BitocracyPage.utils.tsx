import React from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { Proposal } from '../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../utils/helpers';
import { decimalic } from '../../../utils/math';
import { BLOCK_TIME_IN_SECONDS } from './BitocracyPage.constants';

export const renderProposalEndDate = (item: Proposal) => {
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

export const shouldProposalBeDefeated = (proposal: Proposal) => {
  const totalVotes = Decimal.fromBigNumberString(proposal.votesFor).add(
    Decimal.fromBigNumberString(proposal.votesAgainst),
  );

  const supportPercentage = Decimal.fromBigNumberString(proposal.votesFor)
    .div(totalVotes)
    .mul(100);

  return (
    supportPercentage.lte(proposal.emittedBy.majorityPercentageVotes) ||
    decimalic(totalVotes).lt(Decimal.fromBigNumberString(proposal.quorum))
  );
};
