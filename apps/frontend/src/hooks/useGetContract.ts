import { ethers } from 'ethers';

import { ChainId } from '@sovryn/ethers-provider';

import { defaultChainId } from '../config/chains';

import { useLoadContract } from './useLoadContract';

export const useGetProtocolContract = (
  contractName: string,
  chain: ChainId = defaultChainId,
  customSigner?: ethers.providers.JsonRpcSigner,
) => useLoadContract(contractName, 'protocol', chain, customSigner);

export const useGetTokenContract = (
  contractName: string,
  chain: ChainId = defaultChainId,
  customSigner?: ethers.providers.JsonRpcSigner,
) => useLoadContract(contractName, 'tokens', chain, customSigner);
