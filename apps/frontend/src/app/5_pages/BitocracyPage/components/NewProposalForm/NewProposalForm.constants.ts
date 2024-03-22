import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import {
  ProposalCreationParameter,
  ProposalCreationType,
} from '../../contexts/ProposalContext.types';
import { ProposalContract, ProposalTreasury } from './NewProposalForm.types';

export const PROPOSAL_TYPE_OPTIONS = [
  {
    value: ProposalCreationType.Parameters,
    label: t(translations.bitocracyPage.proposalInitialStep.parameter),
  },
  {
    value: ProposalCreationType.Proclamation,
    label: t(translations.bitocracyPage.proposalInitialStep.proclamation),
  },
  {
    value: ProposalCreationType.Treasury,
    label: t(translations.bitocracyPage.proposalInitialStep.treasury),
  },
];

export const PROPOSAL_TOKEN_OPTIONS = [
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
  ...PROPOSAL_TOKEN_OPTIONS,
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

export const DEFAULT_PARAMETER: ProposalCreationParameter = {
  target: '',
  value: '0x0',
  signature: '',
  calldata: '0x0',
  parametersStepExtraData: {
    functionName: ProposalContract.SovrynProtocol,
    newValue: '',
    index: 1,
    parameterName: '',
  },
  treasuryStepExtraData: {
    recipientAddress: '',
    token: COMMON_SYMBOLS.BTC,
    amount: '0',
    index: 1,
  },
};
