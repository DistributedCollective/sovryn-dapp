import { ChainId, ChainIds } from '@sovryn/ethers-provider';
import { ContractConfigData } from '../../types/config';
import { getContract } from './global';

export const getTokenContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'tokens', chain);

export const getLoanTokenContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'loanTokens', chain);

export const getProtocolContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'protocol', chain);
