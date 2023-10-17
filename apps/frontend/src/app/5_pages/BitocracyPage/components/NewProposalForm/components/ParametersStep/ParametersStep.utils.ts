import { ProposalContract } from '../../NewProposalForm.types';
import {
  LOAN_TOKEN_LOGIC_LM_OPTIONS,
  LOAN_TOKEN_LOGIC_WRBTC_OPTIONS,
  LOAN_TOKEN_OPTIONS,
  SOVRYN_PROTOCOL_OPTIONS,
  STAKING_CONTRACT_OPTIONS,
} from './ParametersStep.constants';

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
