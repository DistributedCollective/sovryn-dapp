import { SupportedTokens, getTokenContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

export const makeTokenAddress = async (
  token: SupportedTokens,
  chainId?: ChainIds,
): Promise<string> => getTokenContract(token, chainId).then(c => c.address);
