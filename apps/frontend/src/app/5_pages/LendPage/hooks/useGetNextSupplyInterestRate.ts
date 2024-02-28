import { SupportedTokens } from '@sovryn/contracts';

import { defaultRskChainId } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks/useCacheCall';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetNextSupplyInterestRate = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens', defaultRskChainId);

  const { value: interestRate } = useCacheCall(
    `poolToken/${lendContract?.address}/nextSupplyInterestRate`,
    defaultRskChainId,
    async () => lendContract?.nextSupplyInterestRate('0').then(fromWei),
    [],
    '0',
  );

  return { interestRate };
};
