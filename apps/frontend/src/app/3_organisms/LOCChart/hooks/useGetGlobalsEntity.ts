import { zeroClient } from '../../../../utils/clients';
import { useGetGlobalsEntityQuery } from '../../../../utils/graphql/zero/generated';

export const useGetGlobalsEntity = () => {
  return useGetGlobalsEntityQuery({
    client: zeroClient,
  });
};
