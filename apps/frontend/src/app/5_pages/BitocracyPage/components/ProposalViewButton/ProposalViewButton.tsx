import React, { FC } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { ProposalProps } from '../../BitocracyPage.types';
import { prettifyId } from '../../BitocracyPage.utils';

export const ProposalViewButton: FC<ProposalProps> = ({ proposal }) => {
  const navigate = useNavigate();
  return (
    <Button
      text={t(translations.bitocracyPage.actions.view)}
      style={ButtonStyle.secondary}
      dataAttribute="bitocracy-proposal-view-button"
      onClick={() => navigate(`/bitocracy/proposal/${prettifyId(proposal.id)}`)}
    />
  );
};
