import { useMemo } from 'react';

// import { useAccount } from '../../../../hooks/useAccount';
import { rskClient } from '../../../../utils/clients';
import { useGetLoansQuery } from '../../../../utils/graphql/rsk/generated';

export const useGetLoanIds = () => {
  // const { account } = useAccount();
  const account = '0x605e01516891c9b7a97ab7a393cd991ce7acf711';
  const { loading, data, refetch } = useGetLoansQuery({
    variables: {
      user: account?.toLowerCase(),
    },
    client: rskClient,
  });

  const loans = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.loans;
  }, [data]);

  const loanIds = useMemo(() => loans.map(tx => tx.id), [loans]);

  return { loading, loanIds, loans, refetch };
};
