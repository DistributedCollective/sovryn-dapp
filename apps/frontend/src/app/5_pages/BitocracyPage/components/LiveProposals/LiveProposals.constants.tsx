import React from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { renderEndDate } from '../../BitocracyPage.utils';
import { ProposalStatus } from '../ProposalStatus/ProposalStatus';
import { ProposalType } from '../ProposalType/ProposalType';

export const columnsConfig = [
  {
    id: 'status',
    title: t(translations.bitocracyPage.table.status),
    cellRenderer: (proposal: Proposal) => (
      <ProposalStatus proposal={proposal} />
    ),
  },
  {
    id: 'title',
    title: t(translations.bitocracyPage.table.title),
    cellRenderer: (proposal: Proposal) => (
      <Paragraph
        children={proposal.description}
        className="truncate max-w-64 m-0 sm:text-base"
      />
    ),
  },
  {
    id: 'type',
    title: t(translations.bitocracyPage.table.type),
    cellRenderer: (proposal: Proposal) => (
      <div className="font-semibold">
        <ProposalType proposal={proposal} />
      </div>
    ),
  },
  {
    id: 'endDate',
    title: t(translations.bitocracyPage.table.endDate),
    cellRenderer: renderEndDate,
  },
];
