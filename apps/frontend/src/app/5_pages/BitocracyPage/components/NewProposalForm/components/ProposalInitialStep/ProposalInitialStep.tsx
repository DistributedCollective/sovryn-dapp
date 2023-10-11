import React, { FC } from 'react';

import { t } from 'i18next';

import { Button, Select } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import {
  ProposalCreationStep,
  ProposalCreationType,
} from '../../../../contexts/ProposalContext.types';
import {
  PROPOSAL_CONTRACT_OPTIONS,
  PROPOSAL_TREASURY_OPTIONS,
  PROPOSAL_TYPE_OPTIONS,
} from '../../NewProposalForm.constants';
import { ProposalContract } from '../../NewProposalForm.types';

export type ProposalInitialStepProps = {
  setProposalTab: (value: ProposalCreationStep) => void;
  setProposalType: (value: ProposalCreationType) => void;
  proposalType: ProposalCreationType;
  setParametersContract: (value: ProposalContract) => void;
  parametersContract: ProposalContract;
  setProposalTreasuryAccount: (value: string) => void;
  proposalTreasuryAccount: string;
};

export const ProposalInitialStep: FC<ProposalInitialStepProps> = ({
  setProposalTab,
  setProposalType,
  proposalType,
  setParametersContract,
  parametersContract,
  setProposalTreasuryAccount,
  proposalTreasuryAccount,
}) => (
  <div className="flex flex-col gap-4">
    <Select
      value={proposalType}
      onChange={setProposalType}
      options={PROPOSAL_TYPE_OPTIONS}
      className="w-full"
    />
    {proposalType === ProposalCreationType.Parameters && (
      <Select
        value={parametersContract}
        onChange={setParametersContract}
        options={PROPOSAL_CONTRACT_OPTIONS}
        className="w-full"
      />
    )}
    {proposalType === ProposalCreationType.Treasury && (
      <Select
        value={proposalTreasuryAccount}
        onChange={setProposalTreasuryAccount}
        options={PROPOSAL_TREASURY_OPTIONS}
        className="w-full"
      />
    )}

    <Button
      text={t(translations.common.buttons.continue)}
      className="w-full sm:w-auto"
      onClick={() => setProposalTab(ProposalCreationStep.Details)}
    />
  </div>
);
