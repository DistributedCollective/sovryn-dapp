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
import { ProposalDataForm } from './components/ProposalDataForm/ProposalDataForm';
import { ProposalInitialStep } from './components/ProposalInitialStep/ProposalInitialStep';

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
      <ProposalInitialStep
        setProposalTab={setProposalTab}
        proposalType={proposalType}
        setProposalType={setProposalType}
        proposalContract={proposalContract}
        setProposalContract={setProposalContract}
        proposalTreasuryAccount={proposalTreasuryAccount}
        setProposalTreasuryAccount={setProposalTreasuryAccount}
      />
    );
  } else if (proposalTab === ProposalTab.Overview) {
    return (
      <ProposalDataForm
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
