import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useProposalContext } from '../../contexts/NewProposalContext';
import {
  ProposalCreationStep,
  ProposalCreationType,
} from '../../contexts/ProposalContext.types';
import { PreviewProposalDialog } from './components/PreviewProposalDialog/PreviewProposalDialog';
import { ProposalDataForm } from './components/ProposalDataForm/ProposalDataForm';
import { ProposalInitialStep } from './components/ProposalInitialStep/ProposalInitialStep';
import { TreasuryStep } from './components/TreasuryStep/TreasuryStep';
import { ParametersStep } from './components/ParametersStep/ParametersStep';

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

    if (isPreview) {
      return (
        <PreviewProposalDialog
          disabled={isConfirmButtonDisabled}
          onClose={handleBack}
        />
      );
    }

    if (step === ProposalCreationStep.Details) {
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
    }

    return null;
  }, [
    details,
    handleBack,
    handlePreview,
    handleSubmit,
    isConfirmButtonDisabled,
    isPreview,
    proposalType,
    setDetails,
    setStep,
    step,
  ]);

  return renderContent;

};
