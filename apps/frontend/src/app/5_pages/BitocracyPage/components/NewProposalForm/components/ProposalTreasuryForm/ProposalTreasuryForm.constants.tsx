import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { translations } from '../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../contexts/ProposalContext.types';
import { ProposalTreasuryType } from './ProposalTreasuryForm.types';

export const PROPOSAL_TREASURY_OPTIONS = [
  {
    value: ProposalTreasuryType.governorVaultOwner,
    label: t(
      translations.bitocracyPage.proposalTreasuryForm.governorVaultOwner,
    ),
  },
  {
    value: ProposalTreasuryType.governorVaultAdmin,
    label: t(
      translations.bitocracyPage.proposalTreasuryForm.governorVaultAdmin,
    ),
  },
  {
    value: ProposalTreasuryType.adoptionFund,
    label: t(translations.bitocracyPage.proposalTreasuryForm.adoptionFund),
  },
  {
    value: ProposalTreasuryType.developmentFund,
    label: t(translations.bitocracyPage.proposalTreasuryForm.developmentFund),
  },
];

export const DEFAULT_TRANSFER: ProposalCreationParameter = {
  target: '',
  value: '0x0',
  signature: '',
  calldata: '0x0',
  parametersStepExtraData: {
    treasuryType: ProposalTreasuryType.governorVaultOwner,
    treasuryTypeContract: '',
    recipientAddress: '',
    amount: '',
    token: SupportedTokens.rbtc,
    index: 1,
  },
};
