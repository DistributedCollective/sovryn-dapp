import { ethers } from 'ethers';

import { ProposalCreationParameter } from '../../../../contexts/ProposalContext.types';
import { ProposalContract } from '../../NewProposalForm.types';
import {
  LOAN_TOKEN_LOGIC_LM_OPTIONS,
  LOAN_TOKEN_LOGIC_WRBTC_OPTIONS,
  LOAN_TOKEN_OPTIONS,
  SOVRYN_PROTOCOL_OPTIONS,
  STAKING_CONTRACT_OPTIONS,
} from './ParametersStep.constants';
import { ContractDetailsResponse } from './ParametersStep.types';

export const getParameterOptions = (contractName: string) => {
  switch (contractName) {
    case ProposalContract.SovrynProtocol:
      return SOVRYN_PROTOCOL_OPTIONS;
    case ProposalContract.Staking:
      return STAKING_CONTRACT_OPTIONS;
    case ProposalContract.LoanTokenLogicLM:
      return LOAN_TOKEN_LOGIC_LM_OPTIONS;
    case ProposalContract.LoanTokenLogicWRBTC:
      return LOAN_TOKEN_LOGIC_WRBTC_OPTIONS;
    default:
      return LOAN_TOKEN_OPTIONS;
  }
};

export const getContractDetails = (
  contractName: string,
): ContractDetailsResponse => {
  switch (contractName) {
    case ProposalContract.SovrynProtocol:
      return { contractName: 'protocol', contractGroup: 'protocol' };
    case ProposalContract.Staking:
      return { contractName: 'staking', contractGroup: 'protocol' };
    case ProposalContract.LoanTokenLogicLM:
      return {
        contractName: 'loanTokenLogicBeaconLM',
        contractGroup: 'protocol',
      };
    case ProposalContract.LoanTokenLogicWRBTC:
      return {
        contractName: 'loanTokenLogicBeaconWrbtc',
        contractGroup: 'protocol',
      };
    case ProposalContract.iDOC:
      return { contractName: 'doc', contractGroup: 'loanTokens' };
    case ProposalContract.iUSDT:
      return { contractName: 'usdt', contractGroup: 'loanTokens' };
    case ProposalContract.iRBTC:
      return { contractName: 'rbtc', contractGroup: 'loanTokens' };
    case ProposalContract.iBPRO:
      return { contractName: 'bpro', contractGroup: 'loanTokens' };
    default:
      return { contractName: 'xusd', contractGroup: 'loanTokens' };
  }
};

export const renderCalldata = (contract: string, value: any) => {
  const coder = new ethers.utils.AbiCoder();
  let encodedValue;

  if (typeof value === 'number') {
    // Encode as uint256 for numbers
    encodedValue = coder.encode(['address', 'uint256'], [contract, value]);
  } else if (typeof value === 'boolean') {
    // Encode as bool for booleans
    encodedValue = coder.encode(['address', 'bool'], [contract, value]);
  } else if (typeof value === 'string') {
    // Encode as bytes for strings
    const utf8Bytes = ethers.utils.toUtf8Bytes(contract);
    encodedValue = coder.encode(['address', 'bytes'], [contract, utf8Bytes]);
  } else {
    throw new Error('Unsupported value type');
  }

  return encodedValue;
};

export const renderSignature = (functionName: string) =>
  `${functionName}(address,uint256)`;

export const isValidParameter = (parameter: ProposalCreationParameter) => {
  const { functionName, parameterName, newValue } =
    parameter.parametersStepExtraData || {};
  let isCustomParamValid = true;
  if (functionName === 'custom' && parameter.target === '') {
    isCustomParamValid = false;
  }
  return functionName && parameterName && newValue && isCustomParamValid;
};
