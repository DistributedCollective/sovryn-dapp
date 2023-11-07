import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';

export const SOVRYN_PROTOCOL_OPTIONS = [
  {
    value: 'getTradingRebateRewardsBasisPoint',
    label: 'tradingRebateRewardsBasisPoint',
    signature: 'setTradingRebateRewardsBasisPoint(uint256)',
    types: ['uint256'],
  },
  {
    value: 'priceFeeds',
    label: 'priceFeeds',
    signature: 'setPriceFeedContract(address)',
    types: ['address'],
  },
  {
    value: 'lendingFeePercent',
    label: 'lendingFeePercent',
    signature: 'setLendingFeePercent(uint256)',
    types: ['uint256'],
  },
  {
    value: 'tradingFeePercent',
    label: 'tradingFeePercent',
    signature: 'setTradingFeePercent(uint256)',
    types: ['uint256'],
  },
  {
    value: 'borrowingFeePercent',
    label: 'borrowingFeePercent',
    signature: 'setBorrowingFeePercent(uint256)',
    types: ['uint256'],
  },
  {
    value: 'getSwapExternalFeePercent',
    label: 'getSwapExternalFeePercent',
    signature: 'setSwapExternalFeePercent(uint256)',
    types: ['uint256'],
  },
  {
    value: 'maxDisagreement',
    label: 'maxDisagreement',
    signature: 'setMaxDisagreement(uint256)',
    types: ['uint256'],
  },
  {
    value: 'getPauser',
    label: 'pauser',
    signature: 'setPauser(address)',
    types: ['address'],
  },
  {
    value: 'isProtocolPaused',
    label: 'paused',
    signature: 'setPaused(bool)',
    types: ['bool'],
  },
];

export const STAKING_CONTRACT_OPTIONS = [
  {
    value: 'paused',
    label: 'paused',
    signature: 'setPaused(bool)',
    types: ['bool'],
  },
  {
    value: 'frozen',
    label: 'frozen',
    signature: 'setFrozen(bool)',
    types: ['bool'],
  },
];

export const LOAN_TOKEN_LOGIC_LM_OPTIONS = [
  {
    value: 'paused',
    label: '_paused',
    signature: 'setPaused(bool)',
    types: ['bool'],
  },
];

export const LOAN_TOKEN_LOGIC_WRBTC_OPTIONS = [
  {
    value: 'paused',
    label: '_paused',
    signature: 'setPaused(bool)',
    types: ['bool'],
  },
];

export const LOAN_TOKEN_OPTIONS = [
  {
    value: 'pauser',
    label: 'pauser',
    signature: 'setPauser(address)',
    types: ['address'],
  },
];

export const CUSTOM_OPTION = [
  {
    value: 'custom',
    label: t(translations.common.custom),
    signature: '',
    types: [],
  },
];
