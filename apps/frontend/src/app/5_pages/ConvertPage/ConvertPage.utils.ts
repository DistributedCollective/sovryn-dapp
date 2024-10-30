import { JsonRpcSigner } from '@ethersproject/providers';

import { Contract } from 'ethers';

import { getContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { SmartRouter, SwapRoute } from '@sovryn/sdk';

import { SWAP_ROUTES } from './ConvertPage.constants';
import { getCurrentChain } from '../../../hooks/useChainStore';

export const getRouteContract = async (
  route: SwapRoute,
  signer: JsonRpcSigner,
): Promise<Contract> => {
  let contractName, contractGroup;

  if (route.name === 'ZeroRedemption') {
    contractName = 'troveManager';
    contractGroup = 'zero';
  } else {
    contractName = 'mocIntegrationProxy';
    contractGroup = 'protocol';
  }

  const { address, abi } = await getContract(
    contractName,
    contractGroup,
    getCurrentChain(),
  );

  return new Contract(address, abi, signer);
};

export const getSmartRouter = (chainId: string) =>
  new SmartRouter(getProvider(chainId), SWAP_ROUTES);
