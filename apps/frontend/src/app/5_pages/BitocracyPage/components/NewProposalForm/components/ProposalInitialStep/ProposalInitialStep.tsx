import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, Select } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import {
  ProposalCreationStep,
  ProposalCreationType,
} from '../../../../contexts/ProposalContext.types';
import { PROPOSAL_TYPE_OPTIONS } from '../../NewProposalForm.constants';

export type ProposalInitialStepProps = {
  setProposalTab: (value: ProposalCreationStep) => void;
  setProposalType: (value: ProposalCreationType) => void;
  proposalType: ProposalCreationType;
};

export const ProposalInitialStep: FC<ProposalInitialStepProps> = ({
  setProposalTab,
  setProposalType,
  proposalType,
}) => (
  <div className="flex flex-col gap-4">
    <Select
      value={proposalType}
      onChange={setProposalType}
      options={PROPOSAL_TYPE_OPTIONS}
      className="w-full"
    />

    <Button
      text={t(translations.common.buttons.continue)}
      className="w-full sm:w-auto"
      onClick={() => setProposalTab(ProposalCreationStep.Details)}
    />
  </div>
);
