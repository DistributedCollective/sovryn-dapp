import { useQuery } from '@apollo/client';

import { zeroClient } from '../../../../utils/clients';
import { GetGlobalsEntityDocument } from '../../../../utils/graphql/zero/generated';

export const useGetGlobalsEntity = () => {
  return useQuery(GetGlobalsEntityDocument, {
    client: zeroClient,
  });
};
