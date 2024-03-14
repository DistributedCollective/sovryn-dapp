import { ChainId, ChainIds } from '@sovryn/ethers-provider';

import { AssetDetailsData, ContractConfigData } from '../types';
import {
  getContract,
  getAssetDetailsData,
  getTokenDetailsDataByAddress,
} from './global';

export const getAssetContract = async (
  token: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<ContractConfigData> => getContract(token, 'assets', chain);

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

export const getAsset = async (
  symbol: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<AssetDetailsData> => getAssetDetailsData(symbol, chain);

export const getAssetByAddress = async (
  address: string,
  chain: ChainId = ChainIds.RSK_MAINNET,
): Promise<AssetDetailsData> => getTokenDetailsDataByAddress(address, chain);
