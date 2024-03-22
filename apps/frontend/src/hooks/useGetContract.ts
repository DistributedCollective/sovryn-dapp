import { ethers } from 'ethers';

import { ChainId } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

import { useLoadContract } from './useLoadContract';

export const useGetProtocolContract = (
  contractName: string,
  chain: ChainId = RSK_CHAIN_ID,
  customSigner?: ethers.providers.JsonRpcSigner,
) => useLoadContract(contractName, 'protocol', chain, customSigner);

export const useGetTokenContract = (
  contractName: string,
  chain: ChainId = RSK_CHAIN_ID,
  customSigner?: ethers.providers.JsonRpcSigner,
) => useLoadContract(contractName, 'assets', chain, customSigner);
