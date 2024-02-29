import sanitizeHtml from 'sanitize-html';

import { Proposal } from '../../../utils/graphql/rsk/generated';

export function parseProposalInfo(proposal: Proposal | undefined) {
  if (proposal?.description.includes('\n---\n')) {
    const [title, link, summary, ...rest] = (proposal?.description || '').split(
      '\n',
    );

    const cleanedDescription = sanitizeHtml(
      rest
        .map(line => line.replace(/^\s{4,}/, ''))
        .join('\n')
        .replace('---\n', ''),
    );

    return {
      title: title || '',
      link: link || '',
      summary: summary || '',
      description: cleanedDescription,
    };
  } else if (proposal?.description.startsWith('SIP')) {
    const [title, ...description] = (proposal?.description || '').split(',');

    return {
      title: title || '',
      link: '',
      summary: '',
      description: sanitizeHtml(description.join()),
    };
  } else {
    let title = proposal?.description.slice(0, 50);
    if (proposal && proposal?.description.length > 50) {
      title += '...';
    }

    return {
      title: title || '',
      link: '',
      summary: '',
      description: sanitizeHtml(proposal?.description || ''),
    };
  }
}
