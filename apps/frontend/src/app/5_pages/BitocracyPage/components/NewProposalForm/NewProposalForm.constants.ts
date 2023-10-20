import { ProposalCreationType } from '../../contexts/ProposalContext.types';
import { ProposalContract, ProposalTreasury } from './NewProposalForm.types';

export const PROPOSAL_TYPE_OPTIONS = [
  {
    value: ProposalCreationType.Parameters,
    label: ProposalCreationType.Parameters,
  },
  {
    value: ProposalCreationType.Proclamation,
    label: ProposalCreationType.Proclamation,
  },
  {
    value: ProposalCreationType.Treasury,
    label: ProposalCreationType.Treasury,
  },
];

export const PROPOSAL_CONTRACT_OPTIONS = [
  {
    value: ProposalContract.SovrynProtocol,
    label: ProposalContract.SovrynProtocol,
  },
  {
    value: ProposalContract.Staking,
    label: ProposalContract.Staking,
  },
  {
    value: ProposalContract.LoanTokenLogicLM,
    label: ProposalContract.LoanTokenLogicLM,
  },
  {
    value: ProposalContract.LoanTokenLogicWRBTC,
    label: ProposalContract.LoanTokenLogicWRBTC,
  },
  {
    value: ProposalContract.iDOC,
    label: ProposalContract.iDOC,
  },
  {
    value: ProposalContract.iUSDT,
    label: ProposalContract.iUSDT,
  },
  {
    value: ProposalContract.iRBTC,
    label: ProposalContract.iRBTC,
  },
  {
    value: ProposalContract.iBPRO,
    label: ProposalContract.iBPRO,
  },
  {
    value: ProposalContract.iXUSD,
    label: ProposalContract.iXUSD,
  },
];

export const PROPOSAL_TREASURY_OPTIONS = [
  {
    value: ProposalTreasury.SovrynProtocol,
    label: ProposalTreasury.SovrynProtocol,
  },
  {
    value: ProposalTreasury.Staking,
    label: ProposalTreasury.Staking,
  },
  {
    value: ProposalTreasury.LoanTokenLogicLM,
    label: ProposalTreasury.LoanTokenLogicLM,
  },
  {
    value: ProposalTreasury.AdoptionFund,
    label: ProposalTreasury.AdoptionFund,
  },
  {
    value: ProposalTreasury.DevelopmentFund,
    label: ProposalTreasury.DevelopmentFund,
  },
  {
    value: ProposalTreasury.EcosystemFund,
    label: ProposalTreasury.EcosystemFund,
  },
];
