import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Select, Button } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import {
  PROPOSAL_CONTRACT_OPTIONS,
  PROPOSAL_TYPE_OPTIONS,
  PROPOSAL_TREASURY_OPTIONS,
} from './NewProposalForm.constants';
import { ProposalType } from './NewProposalForm.types';

export const NewProposalForm: FC = () => {
  const [proposalType, setProposalType] = useState(ProposalType.Parameter);
  const [proposalContract, setProposalContract] = useState('');
  const [proposalTreasuryAccount, setProposalTreasuryAccount] = useState('');

  return (
    <>
      <div className="flex flex-col gap-4">
        <Select
          value={proposalType}
          onChange={setProposalType}
          options={PROPOSAL_TYPE_OPTIONS}
          className="w-full"
        />
        {proposalType === ProposalType.Parameter && (
          <Select
            value={proposalContract}
            onChange={setProposalContract}
            options={PROPOSAL_CONTRACT_OPTIONS}
            className="w-full"
          />
        )}
        {proposalType === ProposalType.Treasury && (
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
        />
      </div>
    </>
  );
};
