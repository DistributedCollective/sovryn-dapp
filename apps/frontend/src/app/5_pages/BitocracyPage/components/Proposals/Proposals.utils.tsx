import React from 'react';

import classNames from 'classnames';

import { ProposalState } from '../../BitocracyPage.types';
import { StatusIcons } from './Proposals.constants';

export const getStatusIcon = (status: ProposalState) => (
  <img
    src={StatusIcons[status]}
    alt="proposal-status-icon"
    className={classNames(
      'mr-1',
      status !== ProposalState.Active && 'opacity-70',
    )}
  />
);
