import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useProposalContext } from '../../contexts/NewProposalContext';
import {
  ProposalCreationStep,
  ProposalCreationType,
} from '../../contexts/ProposalContext.types';
import { ParametersStep } from './components/ParametersStep/ParametersStep';
import { PreviewProposalDialog } from './components/PreviewProposalDialog/PreviewProposalDialog';
import { ProposalDataForm } from './components/ProposalDataForm/ProposalDataForm';
import { ProposalInitialStep } from './components/ProposalInitialStep/ProposalInitialStep';
import { TreasuryStep } from './components/TreasuryStep/TreasuryStep';

export const NewProposalForm: FC = () => {
  const {
    step,
    setStep,
    type: proposalType,
    setType: setProposalType,
    submit,
  } = useProposalContext();
  const [isPreview, setIsPreview] = useState(false);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);

  const handlePreview = useCallback(() => {
    setIsPreview(true);
  }, []);

  const handleBack = useCallback(() => {
    setIsPreview(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (step === ProposalCreationStep.Details) {
      if (proposalType === ProposalCreationType.Proclamation) {
        submit();
      } else if (proposalType === ProposalCreationType.Treasury) {
        setStep(ProposalCreationStep.Treasury);
      } else {
        setStep(ProposalCreationStep.Parameters);
      }
    }
  }, [proposalType, setStep, step, submit]);

  useEffect(() => {
    setStep(ProposalCreationStep.SelectType);
  }, [setStep]);

  const renderContent = useMemo(() => {
    if (step === ProposalCreationStep.SelectType) {
      return (
        <ProposalInitialStep
          setProposalTab={setStep}
          proposalType={proposalType}
          setProposalType={setProposalType}
        />
      );
    }

    if (isPreview) {
      return (
        <PreviewProposalDialog
          disabled={isConfirmButtonDisabled}
          onClose={handleBack}
        />
      );
    }

    if (step === ProposalCreationStep.Parameters) {
      return (
        <ParametersStep
          onPreview={handlePreview}
          updateConfirmButtonState={setIsConfirmButtonDisabled}
        />
      );
    }

    if (step === ProposalCreationStep.Treasury) {
      return (
        <TreasuryStep
          onPreview={handlePreview}
          updateConfirmButtonState={setIsConfirmButtonDisabled}
        />
      );
    }

    if (step === ProposalCreationStep.Details) {
      return (
        <ProposalDataForm
          proposalType={proposalType}
          onBack={() => setStep(ProposalCreationStep.SelectType)}
          onPreview={handlePreview}
          onSubmit={handleSubmit}
          updateConfirmButtonState={setIsConfirmButtonDisabled}
        />
      );
    }

    return null;
  }, [
    handleBack,
    handlePreview,
    handleSubmit,
    setProposalType,
    isConfirmButtonDisabled,
    isPreview,
    proposalType,
    setStep,
    step,
  ]);

  return renderContent;
};
