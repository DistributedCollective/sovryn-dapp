import { useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { rskClient } from '../../../../utils/clients';
import { useGetLoansQuery } from '../../../../utils/graphql/rsk/generated';

export const useGetLoanIds = () => {
  const { account } = useAccount();
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
