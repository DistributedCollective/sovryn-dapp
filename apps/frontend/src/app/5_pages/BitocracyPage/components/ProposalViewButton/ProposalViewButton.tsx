import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { ProposalProps } from '../../BitocracyPage.types';

export const ProposalViewButton: FC<ProposalProps> = ({ proposal }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(
    () => navigate(`/bitocracy/${proposal.id}`),
    [navigate, proposal.id],
  );

  return (
    <Button
      text={t(translations.bitocracyPage.actions.view)}
      style={ButtonStyle.secondary}
      onClick={handleClick}
      dataAttribute="bitocracy-proposal-view-button"
    />
  );
};
