import { ContractInterface } from 'ethers';
import get from 'lodash.get';
import set from 'lodash.set';

import {
  ChainId,
  getChainIdByNetwork,
  getNetworkByChainId,
  Network,
} from '@sovryn/ethers-provider';

import {
  AsyncContractConfigData,
  ContractConfigData,
  ContractData,
  ContractGroup,
  SupportedTokenList,
  SupportedTokens,
  TokenDetailsData,
} from '../types';

const cacheByAddress = new Map<string, ContractData>();
const cacheByKey: Record<
  ChainId,
  Record<ContractGroup, Record<string, ContractConfigData>>
> = {};

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

  let contractData: ContractConfigData;

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

  set(cacheByKey, [chainId, group, name], contractData);

  return contractData;
};

export const getContractGroupAbi = async (
  group: ContractGroup,
): Promise<ContractInterface> => {
  switch (group) {
    case 'tokens':
    case 'loanTokens':
      return (await import('../abis/erc20.json')).default;
    default:
      throw new Error(`getContractGroupAbi: Unknown group: ${group}`);
  }
};

export const getTokenDetailsData = async (
  name: SupportedTokens,
  chainId: ChainId,
): Promise<TokenDetailsData> => {
  const tokenBaseInfo = SupportedTokenList?.[name];

  if (!tokenBaseInfo) {
    throw new Error(`getTokenDetails: Unsupported token: ${name}`);
  }

  const contract = await getContract(name, 'tokens', chainId);

  const tokenLogo = await import(`../tokenDetails/logos/xusd`).then(
    item => item.default,
  );

  if (!tokenLogo) {
    throw new Error(`getTokenDetails: Logo not found for token: ${name}`);
  }

  const tokenDetails: TokenDetailsData = {
    address: contract.address,
    abi: contract.abi,
    symbol: tokenBaseInfo.symbol,
    decimalPrecision: tokenBaseInfo.decimalPrecision,
    icon: tokenLogo,
  };

  return tokenDetails;
};
