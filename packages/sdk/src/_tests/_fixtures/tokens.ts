import { getAssetContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

export const makeTokenAddress = async (
  token: string,
  chainId?: ChainIds,
): Promise<string> => getAssetContract(token, chainId).then(c => c.address);
