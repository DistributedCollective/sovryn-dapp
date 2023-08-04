import { SupportedTokens } from '@sovryn/contracts';

import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetNextSupplyInterestRate = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');

  const { value: interestRate } = useCacheCall(
    `poolToken/${lendContract?.address}/nextSupplyInterestRate`,
    async () => lendContract?.nextSupplyInterestRate('0').then(fromWei),
    [],
    '0',
  );

  return { interestRate };
};
