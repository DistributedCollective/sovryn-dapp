import { useQuery } from '@apollo/client';

import { zeroClient } from '../../../../utils/clients';
import { GetTrovesDocument } from '../../../../utils/graphql/zero/generated';

const trovesCount = 1000;

export const useGetTroves = () =>
  useQuery(GetTrovesDocument, {
    variables: {
      first: trovesCount,
    },
    client: zeroClient,
  });
