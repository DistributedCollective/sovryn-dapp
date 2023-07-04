import { useAccount } from '../../../../../../hooks/useAccount';
import { rskClient } from '../../../../../../utils/clients';
import { useGetVestingContractsQuery } from '../../../../../../utils/graphql/rsk/generated';
import { VestingContractTableRecord } from '../Vesting.types';

export const useGetVestingContracts = ():
  | VestingContractTableRecord[]
  | undefined => {
  const { account } = useAccount();

  const vestings = useGetVestingContractsQuery({
    variables: { user: account?.toLowerCase() },
    client: rskClient,
  });

  return vestings?.data?.vestingContracts.map(item => ({
    type: item.type,
    currentBalance: item.currentBalance,
    address: item.id,
    cliff: item.cliff || 0,
  }));
};
