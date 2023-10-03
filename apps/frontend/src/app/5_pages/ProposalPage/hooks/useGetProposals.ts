import { useMemo } from 'react';

import { areAddressesEqual } from '../../../../utils/helpers';
import { useGetProposals } from '../../BitocracyPage/hooks/useGetProposals';

export const useGetProposalById = (id: string | undefined) => {
  const { loading, data } = useGetProposals();

  const proposal = useMemo(
    () => data.find(item => areAddressesEqual(item.id, id || '')),
    [data, id],
  );

  return { loading, proposal };
};
