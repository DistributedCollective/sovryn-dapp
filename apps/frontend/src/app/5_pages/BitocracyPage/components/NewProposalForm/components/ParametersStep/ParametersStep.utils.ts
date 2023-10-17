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
      return { contractName: 'staking', contractGroup: 'protocol' }; // TODO: Add the address and the ABI, this is just a placeholder
    case ProposalContract.LoanTokenLogicWRBTC:
      return { contractName: 'rbtc', contractGroup: 'loanTokens' }; // TODO: Add the address and the ABI, this is just a placeholder
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
