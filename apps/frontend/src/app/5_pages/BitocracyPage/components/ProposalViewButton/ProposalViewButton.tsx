import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { ProposalProps } from '../../BitocracyPage.types';

export const ProposalViewButton: FC<ProposalProps> = ({ proposal }) => (
  <Button
    text={t(translations.bitocracyPage.actions.view)}
    style={ButtonStyle.secondary}
    dataAttribute="bitocracy-proposal-view-button"
    onClick={() => window.open(`/bitocracy/proposal/${proposal.id}`, '_blank')}
  />
);
