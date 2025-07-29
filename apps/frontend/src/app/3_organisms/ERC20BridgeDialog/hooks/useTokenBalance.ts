import { useQuery } from '@tanstack/react-query';

import { ChainId } from '@sovryn/ethers-provider';

import { useAccount } from '../../../../hooks';
import { useBridgeService } from './useBridgeService';

export function useTokenBalance(
  asset: string | undefined,
  chain: ChainId | undefined,
) {
  const bridgeService = useBridgeService();
  const { account } = useAccount();

  return useQuery({
    queryKey: ['tokenBalance', chain, asset, account],
    queryFn: () => bridgeService.getBalance(chain!, asset!, account!),
    enabled: Boolean(bridgeService && account && chain && asset),
  });
}
