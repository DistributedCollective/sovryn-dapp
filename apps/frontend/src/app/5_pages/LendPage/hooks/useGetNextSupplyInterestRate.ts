import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetNextSupplyInterestRate = (asset: string) => {
  const lendContract = useLoadContract(asset, 'loanTokens', RSK_CHAIN_ID);

  const { value: interestRate } = useCacheCall(
    `poolToken/${lendContract?.address}/nextSupplyInterestRate`,
    RSK_CHAIN_ID,
    async () => lendContract?.nextSupplyInterestRate('0').then(fromWei),
    [],
    '0',
  );

  return { interestRate };
};
