import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';

// TODO: We need to add gas calculations and other possible restrictions
export const useGetMaxDeposit = (assetA: string, assetB: string) => {
  const { balance: balanceTokenA } = useAssetBalance(assetA, BOB_CHAIN_ID);
  const { balance: balanceTokenB } = useAssetBalance(assetB, BOB_CHAIN_ID);

  return { balanceTokenA, balanceTokenB };
};
