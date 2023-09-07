import React from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import iconActive from '../../../../../assets/images/ProposalStatuses/icon-active.svg';
import iconExecuted from '../../../../../assets/images/ProposalStatuses/icon-executed.svg';
import iconPending from '../../../../../assets/images/ProposalStatuses/icon-pending.svg';
import iconRejected from '../../../../../assets/images/ProposalStatuses/icon-rejected.svg';
import iconSucceed from '../../../../../assets/images/ProposalStatuses/icon-succeed.svg';
import { translations } from '../../../../../locales/i18n';
import { Proposal } from '../../../../../utils/graphql/rsk/generated';
import { ProposalState } from '../../BitocracyPage.types';
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

export const StatusIcons: Record<ProposalState, string> = {
  [ProposalState.Canceled]: iconRejected,
  [ProposalState.Pending]: iconPending,
  [ProposalState.Active]: iconActive,
  [ProposalState.Defeated]: iconRejected,
  [ProposalState.Succeeded]: iconSucceed,
  [ProposalState.Executed]: iconExecuted,
  [ProposalState.Expired]: iconRejected,
  [ProposalState.Queued]: iconPending,
};

export const GRACE_PERIOD_IN_SECONDS = 1209600; // 14 days

export const SIGNATURE_SYMBOL = 'symbol()';
