import sanitizeHtml from 'sanitize-html';

import { Proposal } from '../../../utils/graphql/rsk/generated';
import { BLOCK_TIME_IN_SECONDS } from '../BitocracyPage/BitocracyPage.constants';

export function getSecondsBetweenBlocks(
  startBlock: number,
  endBlock: number,
): number {
  return (Number(endBlock) - Number(startBlock)) * BLOCK_TIME_IN_SECONDS;
}

export function parseProposalInfo(proposal: Proposal | undefined) {
  const [title, link, summary, ...rest] = (proposal?.description || '').split(
    '\n',
  );

  const description = sanitizeHtml(rest.join('\n').replace('---\n', ''));

  return {
    title: title || '',
    link: link || '',
    summary: summary || '',
    description: description || '',
  };
}
