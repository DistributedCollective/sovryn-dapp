import { SupportedTokens } from '@sovryn/contracts';

import { rskChainId } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetNextSupplyInterestRate = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', rskChainId);

  const { value: interestRate } = useCacheCall(
    `poolToken/${lendContract?.address}/nextSupplyInterestRate`,
    rskChainId,
    async () => lendContract?.nextSupplyInterestRate('0').then(fromWei),
    [],
    '0',
  );

  return { interestRate };
};
