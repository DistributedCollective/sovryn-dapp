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
import { ProposalTreasuryForm } from './components/ProposalTreasuryForm/ProposalTreasuryForm';

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
  const [isPreview, setIsPreview] = useState(false);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);

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
    setIsPreview(true);
  }, []);

  const handleConfirmButtonState = useCallback((value: boolean) => {
    setIsConfirmButtonDisabled(value);
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
    return !isPreview ? (
      <ProposalDataForm
        value={details}
        onChange={setDetails}
        proposalType={proposalType}
        onBack={() => setStep(ProposalCreationStep.SelectType)}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
      />
    ) : (
      <PreviewProposalDialog onClose={handleBack} />
    );
  } else if (step === ProposalCreationStep.Treasury) {
    return isPreview ? (
      <PreviewProposalDialog
        disabled={isConfirmButtonDisabled}
        onClose={handleBack}
      />
    ) : (
      <ProposalTreasuryForm
        updateConfirmButtonState={handleConfirmButtonState}
        onPreview={handlePreview}
      />
    );
  } else {
    return null;
  }
};
