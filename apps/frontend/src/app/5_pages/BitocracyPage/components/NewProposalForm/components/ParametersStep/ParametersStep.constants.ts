import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../contexts/ProposalContext.types';
import { ProposalContract } from '../../NewProposalForm.types';

export const SOVRYN_PROTOCOL_OPTIONS = [
  {
    value: 'getTradingRebateRewardsBasisPoint',
    label: 'tradingRebateRewardsBasisPoint',
  },
  {
    value: 'priceFeeds',
    label: 'priceFeeds',
  },
  {
    value: 'lendingFeePercent',
    label: 'lendingFeePercent',
  },
  {
    value: 'tradingFeePercent',
    label: 'tradingFeePercent',
  },
  {
    value: 'borrowingFeePercent',
    label: 'borrowingFeePercent',
  },
  {
    value: 'getSwapExternalFeePercent',
    label: 'getSwapExternalFeePercent',
  },
  {
    value: 'maxDisagreement',
    label: 'maxDisagreement',
  },
  {
    value: 'getPauser',
    label: 'pauser',
  },
  {
    value: 'isProtocolPaused',
    label: 'paused',
  },
];

export const STAKING_CONTRACT_OPTIONS = [
  {
    value: 'paused',
    label: 'paused',
  },
  {
    value: 'frozen',
    label: 'frozen',
  },
];

export const LOAN_TOKEN_LOGIC_LM_OPTIONS = [
  {
    value: 'paused',
    label: '_paused',
  },
];

export const LOAN_TOKEN_LOGIC_WRBTC_OPTIONS = [
  {
    value: 'paused',
    label: '_paused',
  },
];

export const LOAN_TOKEN_OPTIONS = [
  {
    value: 'pauser',
    label: 'pauser',
  },
  {
    value: 'paused',
    label: 'paused',
  },
];

export const CUSTOM_OPTION = [
  {
    value: 'custom',
    label: t(translations.common.custom),
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
  },
};
