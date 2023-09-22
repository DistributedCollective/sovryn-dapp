import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Select, Button } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import {
  proposalContractOptions,
  proposalTreasuryOptions,
  proposalTypeOptions,
} from './NewProposalForm.constants';
import { ProposalType } from './NewProposalForm.types';

type NewLoanFormProps = {
  onSuccess: () => void;
};

export const NewProposalForm: FC<NewLoanFormProps> = () => {
  const [proposalType, setProposalType] = useState(ProposalType.Parameter);
  const [proposalContract, setProposalContract] = useState('');
  const [proposalTreasuryAccount, setProposalTreasuryAccount] = useState('');
  return (
    <>
      <div className="flex flex-col gap-4">
        <Select
          value={proposalType}
          onChange={setProposalType}
          options={proposalTypeOptions}
          className="w-full"
        />
        {proposalType === ProposalType.Parameter && (
          <Select
            value={proposalContract}
            onChange={setProposalContract}
            options={proposalContractOptions}
            className="w-full"
          />
        )}
        {proposalType === ProposalType.Treasury && (
          <Select
            value={proposalTreasuryAccount}
            onChange={setProposalTreasuryAccount}
            options={proposalTreasuryOptions}
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
