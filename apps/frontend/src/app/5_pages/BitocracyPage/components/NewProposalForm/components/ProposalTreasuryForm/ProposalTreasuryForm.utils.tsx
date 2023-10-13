import { SupportedTokens } from '@sovryn/contracts';

import {
  ProposalTransferData,
  ProposalTreasuryType,
} from './ProposalTreasuryForm.types';

export const initialTransfer: ProposalTransferData = {
  treasuryType: ProposalTreasuryType.governorVaultOwner,
  treasuryTypeContract: '',
  recipientAddress: '',
  amount: '',
  token: SupportedTokens.sov,
};
