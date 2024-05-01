import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';

// TODO: We need to add gas calculations and other possible restrictions
export const useGetMaxDeposit = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();

  const { balance: balanceTokenA } = useAssetBalance(assetA, chainId);
  const { balance: balanceTokenB } = useAssetBalance(assetB, chainId);

  return { balanceTokenA, balanceTokenB };
};
