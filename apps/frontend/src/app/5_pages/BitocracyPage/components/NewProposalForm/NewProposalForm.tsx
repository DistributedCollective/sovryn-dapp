import React, { FC, useEffect, useState } from 'react';

import { t } from 'i18next';

import { getProtocolContract } from '@sovryn/contracts';
import { Select, Button, SelectOption } from '@sovryn/ui';

import { defaultChainId } from '../../../../../config/chains';

import { translations } from '../../../../../locales/i18n';
import { useProposalContext } from '../../contexts/NewProposalContext';
import { ProposalCreationType } from '../../contexts/ProposalContext.types';
import {
  PROPOSAL_TYPE_OPTIONS,
  PROPOSAL_TREASURY_OPTIONS,
} from './NewProposalForm.constants';
import {
  ProposalOverviewData,
  ProposalTab,
  ProposalType,
} from './NewProposalForm.types';
import { ProposalOverview } from './components/ProposalOverview/ProposalOverview';

export const NewProposalForm: FC = () => {
  const {
    type: proposalType,
    setType: setProposalType,
    setDetails,
    governor,
    setGovernor,
    submit,
  } = useProposalContext();
  const [proposalTreasuryAccount, setProposalTreasuryAccount] = useState('');
  const [governors, setGovernors] = useState<SelectOption<string>[]>([]);

  // todo: these should be implemented in their own components.
  useEffect(() => {
    setDetails({
      title: 'SIP: Default title',
      link: 'https://sovryn.app',
      summary: 'Default summary',
      text: 'Default *text*',
    });
    Promise.all([
      getProtocolContract('governorOwner', defaultChainId),
      getProtocolContract('governorAdmin', defaultChainId),
    ]).then(([owner, admin]) => {
      setGovernors([
        {
          label: 'Owner',
          value: owner.address,
        },
        {
          label: 'Admin',
          value: admin.address,
        },
      ]);
      setGovernor(owner.address);
    });
  }, [setDetails, setGovernor]);

  if (proposalTab === ProposalTab.Initial) {
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
            onClick={() => setProposalTab(ProposalTab.Overview)}
          />
        </div>
      </>
    );
  } else if (proposalTab === ProposalTab.Overview) {
    return (
      <ProposalOverview
        value={form}
        onChange={setForm}
        proposalType={proposalType}
        onBack={() => setProposalTab(ProposalTab.Initial)}
      />
    );
  } else {
    return null;
  }
};
