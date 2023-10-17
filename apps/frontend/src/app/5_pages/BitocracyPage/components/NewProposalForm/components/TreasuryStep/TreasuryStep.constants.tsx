import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { translations } from '../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../contexts/ProposalContext.types';
import { TreasuryType } from './TreasuryStep.types';

export const TREASURY_OPTIONS = [
  {
    value: TreasuryType.governorVaultOwner,
    label: t(
      translations.bitocracyPage.proposalTreasuryForm.governorVaultOwner,
    ),
  },
  {
    value: TreasuryType.governorVaultAdmin,
    label: t(
      translations.bitocracyPage.proposalTreasuryForm.governorVaultAdmin,
    ),
  },
  {
    value: TreasuryType.adoptionFund,
    label: t(translations.bitocracyPage.proposalTreasuryForm.adoptionFund),
  },
  {
    value: TreasuryType.developmentFund,
    label: t(translations.bitocracyPage.proposalTreasuryForm.developmentFund),
  },
];

export const DEFAULT_PARAMETER: ProposalCreationParameter = {
  target: '',
  value: '0x0',
  signature: '',
  calldata: '0x0',
  parametersStepExtraData: {
    treasuryType: TreasuryType.governorVaultOwner,
    recipientAddress: '',
    token: SupportedTokens.rbtc,
    index: 1,
  },
};
