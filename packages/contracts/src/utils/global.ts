import type { Provider } from '@ethersproject/providers';

import { ContractInterface, Contract, Signer } from 'ethers';
import get from 'lodash.get';
import set from 'lodash.set';

import {
  ChainId,
  getChainIdByNetwork,
  getNetworkByChainId,
  Network,
} from '@sovryn/ethers-provider';

import { SupportedTokenList } from '../tokenDetails';
import {
  AsyncContractConfigData,
  ContractConfigData,
  ContractData,
  ContractGroup,
  SupportedTokens,
  TokenBaseInfo,
  TokenDetailsData,
} from '../types';

const cacheByAddress = new Map<string, ContractData>();
const cacheByKey: Record<
  ChainId,
  Record<ContractGroup, Record<string, ContractConfigData>>
> = {};
const iconCache = new Map<SupportedTokens, string>();

export const findContract = async (address: string): Promise<ContractData> => {
  address = address.toLowerCase();
  if (cacheByAddress.has(address)) {
    return cacheByAddress.get(address)!;
  }

  const contracts = await import('../contracts').then(m => m.contracts);

  const groups = Object.keys(contracts);
  let contractData: ContractData | undefined;

  loop: for (const group of groups) {
    const networks = Object.keys(contracts[group]);
    for (const network of networks) {
      const obj = contracts[group][network];
      let key = Object.keys(obj).find(k =>
        typeof obj[k] === 'string'
          ? obj[k].toLowerCase() === address
          : obj[k].address.toLowerCase() === address,
      );
      if (key) {
        contractData = {
          address,
          group: group as ContractGroup,
          name: key,
          chainId: getChainIdByNetwork(network as Network),
          abi:
            typeof obj[key] === 'string'
              ? await getContractGroupAbi(group as ContractGroup)
              : await obj[key].getAbi(),
        };
        break loop;
      }
    }
  }

  if (contractData) {
    cacheByAddress.set(address, contractData);
    return contractData;
  }

  throw new Error(`findContract: Unknown contract: ${address}`);
};

export const getContract = async (
  name: string,
  group: ContractGroup,
  chainId: ChainId,
): Promise<ContractConfigData> => {
  const cached = get(cacheByKey, [chainId, group, name]);
  if (cached) {
    return cached;
  }

  const contracts = await import('../contracts').then(m => m.contracts);

  const contract: string | AsyncContractConfigData = get(contracts, [
    group,
    getNetworkByChainId(chainId),
    name,
  ]);

  if (!contract) {
    throw new Error(`getContract: Unknown contract: ${name}`);
  }

  let contractData: Omit<ContractConfigData, 'contract'>;

  if (typeof contract === 'string') {
    contractData = {
      address: contract.toLowerCase(),
      abi: await getContractGroupAbi(group),
    };
  } else {
    contractData = {
      address: contract.address.toLowerCase(),
      abi: await contract.getAbi(),
    };
  }

  const data: ContractConfigData = {
    address: contractData.address,
    abi: contractData.abi,
    contract: (signerOrProvider?: Signer | Provider) =>
      new Contract(contractData.address, contractData.abi, signerOrProvider),
  };

  set(cacheByKey, [chainId, group, name], data);

  return data;
};

export const getContractGroupAbi = async (
  group: ContractGroup,
): Promise<ContractInterface> => {
  switch (group) {
    case 'tokens':
      return (await import('../abis/erc20.json')).default;
    case 'loanTokens':
      return (await import('../abis/loanToken.json')).default;
    default:
      throw new Error(`getContractGroupAbi: Unknown group: ${group}`);
  }
};

export const resolveIcon = async (tokenBaseInfo: TokenBaseInfo) => {
  const { symbol, getIcon } = tokenBaseInfo;

  if (iconCache.has(symbol)) {
    return iconCache.get(symbol);
  }

  const icon = await getIcon();

  if (!icon) {
    throw new Error(`getTokenDetails: Icon not found for token: ${symbol}`);
  }

  iconCache.set(symbol, icon);
  return icon;
};

export const getTokenDetailsData = async (
  name: SupportedTokens,
  chainId: ChainId,
): Promise<TokenDetailsData> => {
  const tokenBaseInfo = SupportedTokenList.find(token => token.symbol === name);

  if (!tokenBaseInfo) {
    throw new Error(`getTokenDetails: Unsupported token: ${name}`);
  }

  const { address, abi } = await getContract(name, 'tokens', chainId);

  const icon = await resolveIcon(tokenBaseInfo);

  const tokenDetails: TokenDetailsData = {
    address,
    abi,
    symbol: tokenBaseInfo.symbol,
    decimalPrecision: tokenBaseInfo.decimalPrecision,
    icon,
  };

  return tokenDetails;
};

export const getTokenDetailsDataByAddress = async (
  address: string,
): Promise<TokenDetailsData> => {
  const contract = await findContract(address);

  const tokenBaseInfo = SupportedTokenList.find(
    token => token.symbol === contract.name,
  );

  if (!tokenBaseInfo) {
    throw new Error(`getTokenDetails: Unsupported token: ${address}`);
  }

  const icon = await resolveIcon(tokenBaseInfo);

  const tokenDetails: TokenDetailsData = {
    address,
    abi: contract.abi,
    symbol: tokenBaseInfo.symbol,
    decimalPrecision: tokenBaseInfo.decimalPrecision,
    icon,
  };

  return tokenDetails;
};
