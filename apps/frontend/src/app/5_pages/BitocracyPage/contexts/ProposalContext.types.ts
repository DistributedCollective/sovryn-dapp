import { Dispatch, SetStateAction } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { TransactionCallbacks } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';

export type ProposalContextValue = {
  step: ProposalCreationStep;
  setStep: Dispatch<SetStateAction<ProposalCreationStep>>;
  type: ProposalCreationType;
  setType: Dispatch<SetStateAction<ProposalCreationType>>;
  details: ProposalCreationDetails;
  setDetails: Dispatch<SetStateAction<ProposalCreationDetails>>;
  governor: string | null;
  setGovernor: Dispatch<SetStateAction<string | null>>;
  parameters: ProposalCreationParameter[];
  setParameters: Dispatch<SetStateAction<ProposalCreationParameter[]>>;
  submit: (callbacks?: Partial<TransactionCallbacks>) => void;
  reset: () => void;
};

export enum ProposalCreationStep {
  SelectType = 'select-type',
  Details = 'details',
  Parameters = 'parameters',
  Treasury = 'treasury',
  Overview = 'overview',
}

export enum ProposalCreationType {
  Parameters = 'parameters',
  Proclamation = 'proclamation',
  Treasury = 'treasury',
}

export type ProposalCreationDetails = {
  title: string;
  link: string;
  summary: string;
  text: string;
};

export type TreasuryStepExtraData = {
  index?: number;
  functionName?: string;
  newValue?: string;
  recipientAddress?: string;
  token?: SupportedTokens;
  amount?: string;
};

export type ProposalCreationParameter = {
  // address which will be called by the governance contract
  target: string;
  // value of native tokens in wei which will be sent to target (default to "0x0")
  value: string;
  // signature of the function which will be called on target (default to "")
  signature: string;
  // abi encoded arguments (for signature) to be passed to the function (default to "0x0")
  calldata: string;
  // extra data needed for parameters step
  treasuryStepExtraData?: TreasuryStepExtraData;
};
