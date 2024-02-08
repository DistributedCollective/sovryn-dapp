import { JsonRpcSigner } from '@ethersproject/providers';

import { Contract } from 'ethers';

import { getContract } from '@sovryn/contracts';
import { SwapRoute } from '@sovryn/sdk';

import { getRskChainId } from '../../../utils/chain';

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
    getRskChainId(),
  );

  return new Contract(address, abi, signer);
};
