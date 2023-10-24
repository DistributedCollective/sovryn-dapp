import React, { FC, useCallback, useEffect } from 'react';

import { useProposalContext } from '../../contexts/NewProposalContext';
import {
  ProposalCreationStep,
  ProposalCreationType,
} from '../../contexts/ProposalContext.types';
import { ParametersStep } from './components/ParametersStep/ParametersStep';
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
    submit,
  } = useProposalContext();

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

  useEffect(() => {
    setStep(ProposalCreationStep.SelectType);
  }, [setStep]);

  if (step === ProposalCreationStep.SelectType) {
    return (
      <ProposalInitialStep
        setProposalTab={setStep}
        proposalType={proposalType}
        setProposalType={setProposalType}
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
  } else if (step === ProposalCreationStep.Parameters) {
    return (
      <ParametersStep
        onBack={() => setStep(ProposalCreationStep.Details)}
        onPreview={handlePreview}
      />
    );
  } else {
    return null;
  }
};
