import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';

import { isValidChecksumAddress } from 'ethereumjs-util';
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

const encodeParameters = (types: string[], values: any[]): string => {
  const coder = new ethers.utils.AbiCoder();
  return coder.encode(types, values);
};

export const renderCalldata = (value: any, type: string[]) => {
  try {
    const parameters = [value];
    const encodedValue = encodeParameters(type, parameters);
    return encodedValue;
  } catch (error) {
    console.error('Error encoding data:', error);
    throw error;
  }
};

export const isValidParameter = (parameter: ProposalCreationParameter) => {
  const { functionName, parameterName, newValue } =
    parameter.parametersStepExtraData || {};
  const { calldata } = parameter;
  if (functionName === 'custom' || parameterName === 'custom') {
    return (
      parameter?.value &&
      parameter?.signature &&
      parameter?.calldata &&
      parameter?.target
    );
  }
  return functionName && parameterName && newValue && calldata;
};

export const getParameterType = (
  parameterName: string,
  functionName: string,
) => {
  const parameterOptions = getParameterOptions(functionName);
  const parameter = parameterOptions.find(
    option => option.value === parameterName,
  );
  if (parameter) {
    return parameter.types;
  } else {
    return '';
  }
};

export const isValidValue = (parameter: ProposalCreationParameter) => {
  const { functionName, parameterName, newValue } =
    parameter.parametersStepExtraData || {};

  if (functionName === 'custom' || parameterName === 'custom' || !newValue) {
    return true;
  }

  const type = getParameterType(parameterName || '', functionName || '');

  if (!type) {
    return true;
  }

  if (type[0] === 'address') {
    return isValidChecksumAddress(newValue);
  } else if (type[0] === 'uint256') {
    return isBigNumberish(newValue);
  } else if (type[0] === 'bool') {
    return ['true', 'false'].includes(newValue.toLowerCase());
  }
};
