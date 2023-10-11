import React, { FC, useCallback, useEffect, useState } from 'react';

import { getProtocolContract } from '@sovryn/contracts';

import { defaultChainId } from '../../../../../config/chains';

import { useProposalContext } from '../../contexts/NewProposalContext';
import {
  ProposalCreationStep,
  ProposalCreationType,
} from '../../contexts/ProposalContext.types';
import { PreviewProposalDialog } from './components/PreviewProposalDialog/PreviewProposalDialog';
import { ProposalDataForm } from './components/ProposalDataForm/ProposalDataForm';
import { ProposalInitialStep } from './components/ProposalInitialStep/ProposalInitialStep';

export const NewProposalForm: FC = () => {
  const {
    step,
    setStep,
    type: proposalType,
    setType: setProposalType,
    details,
    setDetails,
    governor,
    setGovernor,
    submit,
  } = useProposalContext();
  const [proposalTreasuryAccount, setProposalTreasuryAccount] = useState('');

  // todo: these should be implemented in their own components.
  useEffect(() => {
    Promise.all([
      getProtocolContract('governorOwner', defaultChainId),
      getProtocolContract('governorAdmin', defaultChainId),
    ]).then(([owner, admin]) => {
      setGovernor(owner.address);
    });
  }, [setDetails, setGovernor]);

  const handlePreview = useCallback(() => {
    // todo: also pass current step to know which step to go back to.
    setStep(ProposalCreationStep.Overview);
  }, [setStep]);

  const handleSubmit = useCallback(async () => {
    if (step === ProposalCreationStep.Details) {
      if (proposalType === ProposalCreationType.Proclamation) {
        submit();
      } else {
        setStep(ProposalCreationStep.Parameters);
      }
    }
  }, [proposalType, setStep, step, submit]);

  if (step === ProposalCreationStep.SelectType) {
    return (
      <ProposalInitialStep
        setProposalTab={setStep}
        proposalType={proposalType}
        setProposalType={setProposalType}
        proposalContract={governor || ''}
        setProposalContract={setGovernor}
        proposalTreasuryAccount={proposalTreasuryAccount}
        setProposalTreasuryAccount={setProposalTreasuryAccount}
      />
    );
  } else if (step === ProposalCreationStep.Details) {
    return (
      <ProposalDataForm
        value={details}
        onChange={setDetails}
        proposalType={proposalType}
        onBack={() => setStep(ProposalCreationStep.SelectType)}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
      />
    );
  } else if (step === ProposalCreationStep.Overview) {
    return <PreviewProposalDialog />;
  } else {
    return null;
  }
};
