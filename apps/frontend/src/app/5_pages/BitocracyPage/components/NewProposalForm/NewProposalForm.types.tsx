export enum ProposalContract {
  SovrynProtocol = 'Sovryn Protocol',
  Staking = 'Staking',
  LoanTokenLogicLM = 'LoanTokenLogicLM',
  LoanTokenLogicWRBTC = 'LoanTokenLogicWRBTC',
  iDOC = 'iDOC',
  iUSDT = 'iUSDT',
  iRBTC = 'iRBTC',
  iBPRO = 'iBPRO',
  iXUSD = 'iXUSD',
}

export enum ProposalTreasury {
  SovrynProtocol = 'Sovryn Protocol',
  Staking = 'Staking',
  LoanTokenLogicLM = 'LoanTokenLogicLM',
  AdoptionFund = 'Adoption Fund',
  DevelopmentFund = 'Development Fund',
  EcosystemFund = 'Ecosystem Fund',
}

export interface ProposalOverviewData {
  title: string;
  discussionURL: string;
  summary: string;
  description: string;
}
