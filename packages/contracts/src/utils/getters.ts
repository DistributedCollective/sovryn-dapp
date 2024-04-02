import { ChainId, ChainIds } from '@sovryn/ethers-provider';

import { ContractConfigData } from '../types';
import { getContract } from './global';

export const getAssetContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'assets', chain);

export const getLoanTokenContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'loanTokens', chain);

export const getProtocolContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'protocol', chain);

export const getZeroContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'zero', chain);
