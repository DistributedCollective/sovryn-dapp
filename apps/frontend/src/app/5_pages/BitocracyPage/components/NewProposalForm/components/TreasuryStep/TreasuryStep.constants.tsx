import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { defaultChainId } from '../../../../../../../config/chains';

import { translations } from '../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../contexts/ProposalContext.types';

const governorVaultOwnerAddresses = {
  [ChainIds.RSK_MAINNET]: '0x05f4f068DF59a5aA7911f57cE4f41ebFBcB8E247',
  [ChainIds.RSK_TESTNET]: '0x4b38E84628B9AF558076F683Aee548a0B26dc759',
};

const governorVaultAdminAddresses = {
  [ChainIds.RSK_MAINNET]: '0x51C754330c6cD04B810014E769Dab0343E31409E',
  [ChainIds.RSK_TESTNET]: '0x9110896F01150BeC29ca5346d96Ab71Bf8b062dB',
};

const adoptionFundAddresses = {
  [ChainIds.RSK_MAINNET]: '0x0f31cfd6aAb4d378668Ad74DeFa89d3f4DB26633',
  [ChainIds.RSK_TESTNET]: '0x7A06E28e9504aE3D71D1b98085985b6144351e70',
};

const developmentFundAddresses = {
  [ChainIds.RSK_MAINNET]: '0x617866cC4a089c3653ddC31a618b078291839AeB',
  [ChainIds.RSK_TESTNET]: '0x9235600F36eEc91c94862b27bf21699eb8BdD33c',
};

export const GOVERNOR_VAULT_OWNER_ADDRESS =
  governorVaultOwnerAddresses[defaultChainId];
export const GOVERNOR_VAULT_ADMIN_ADDRESS =
  governorVaultAdminAddresses[defaultChainId];
export const ADOPTION_FUND_ADDRESS = adoptionFundAddresses[defaultChainId];
export const DEVELOPMENT_FUND_ADDRESS =
  developmentFundAddresses[defaultChainId];

export const TREASURY_OPTIONS = [
  {
    value: GOVERNOR_VAULT_OWNER_ADDRESS,
    label: t(
      translations.bitocracyPage.proposalTreasuryForm.governorVaultOwner,
    ),
  },
  {
    value: GOVERNOR_VAULT_ADMIN_ADDRESS,
    label: t(
      translations.bitocracyPage.proposalTreasuryForm.governorVaultAdmin,
    ),
  },
  {
    value: ADOPTION_FUND_ADDRESS,
    label: t(translations.bitocracyPage.proposalTreasuryForm.adoptionFund),
  },
  {
    value: DEVELOPMENT_FUND_ADDRESS,
    label: t(translations.bitocracyPage.proposalTreasuryForm.developmentFund),
  },
];

export const DEFAULT_PARAMETER: ProposalCreationParameter = {
  target: GOVERNOR_VAULT_OWNER_ADDRESS,
  value: '0x0',
  signature: '',
  calldata: '0x0',
  treasuryStepExtraData: {
    recipientAddress: '',
    token: SupportedTokens.rbtc,
    amount: '0',
    index: 1,
  },
};

export const REQUIRED_VOTING_POWER = 0.01;
