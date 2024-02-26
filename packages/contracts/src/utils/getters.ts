import { ChainId, ChainIds } from '@sovryn/ethers-provider';

import {
  ContractConfigData,
  SupportedTokens,
  TokenDetailsData,
} from '../types';
import {
  getContract,
  getTokenDetailsData,
  getTokenDetailsDataByAddress,
} from './global';

export const getTokenContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'tokens', chain);

export const getLoanTokenContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'loanTokens', chain);

export const getLendTokenContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'lendTokens', chain);

export const getProtocolContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'protocol', chain);

export const getZeroContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'zero', chain);

export const getTokenDetails = async (
  token: SupportedTokens,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<TokenDetailsData> => getTokenDetailsData(token, chain);

export const getTokenDetailsByAddress = async (
  address: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<TokenDetailsData> => getTokenDetailsDataByAddress(address, chain);
