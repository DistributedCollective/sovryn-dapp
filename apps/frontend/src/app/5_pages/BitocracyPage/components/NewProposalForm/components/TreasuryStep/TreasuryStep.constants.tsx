import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { translations } from '../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../contexts/ProposalContext.types';

export const GOVERNOR_VAULT_OWNER_ADDRESS =
  '0x05f4f068DF59a5aA7911f57cE4f41ebFBcB8E247';
export const GOVERNOR_VAULT_ADMIN_ADDRESS =
  '0x51C754330c6cD04B810014E769Dab0343E31409E';
export const ADOPTION_FUND_ADDRESS =
  '0x0f31cfd6aAb4d378668Ad74DeFa89d3f4DB26633';
export const DEVELOPMENT_FUND_ADDRESS =
  '0x617866cC4a089c3653ddC31a618b078291839AeB';

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
