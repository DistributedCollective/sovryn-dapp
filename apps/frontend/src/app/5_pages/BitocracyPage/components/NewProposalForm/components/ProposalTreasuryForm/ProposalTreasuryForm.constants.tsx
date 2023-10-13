import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { translations } from '../../../../../../../locales/i18n';
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

export const initialTransferState = {
  treasuryType: ProposalTreasuryType.governorVaultOwner,
  treasuryTypeContract: '',
  recipientAddress: '',
  amount: '',
  token: SupportedTokens.sov,
};
