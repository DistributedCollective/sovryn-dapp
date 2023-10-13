import { SupportedTokens } from '@sovryn/contracts';

export enum ProposalTreasuryType {
  governorVaultOwner = 'governorVaultOwner',
  governorVaultAdmin = 'governorVaultAdmin',
  adoptionFund = 'adoptionFund',
  developmentFund = 'developmentFund',
}

export type ProposalTransferData = {
  treasuryType: ProposalTreasuryType;
  treasuryTypeContract: string;
  recipientAddress: string;
  amount: string;
  token: SupportedTokens;
};

export enum ProposalTransferType {
  treasuryType = 'treasuryType',
  treasuryTypeContract = 'treasuryTypeContract',
  amount = 'amount',
  token = 'token',
  recipientAddress = 'recipientAddress',
}
