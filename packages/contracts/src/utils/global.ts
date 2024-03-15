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

import {
  AssetDetails,
  AssetDetailsData,
  AsyncContractConfigData,
  ContractConfigData,
  ContractData,
  ContractGroup,
} from '../types';

const cacheByAddress = new Map<string, ContractData>();
const cacheByKey: Record<
  ChainId,
  Record<ContractGroup, Record<string, ContractConfigData>>
> = {};
const iconCache = new Map<string, string>();

export const findContract = async (
  address: string,
  chainId?: ChainId, // todo: search by chainId if provided
): Promise<ContractData> => {
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
      let key = Object.keys(obj).find(
        k => obj[k].address.toLowerCase() === address,
      );
      if (key) {
        contractData = {
          address,
          group: group as ContractGroup,
          name: group === 'assets' ? obj[key].symbol : key,
          chainId: getChainIdByNetwork(network as Network),
          abi:
            group === 'assets'
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

  const contracts = await import('../contracts').then(m =>
    get(m.contracts, [group, getNetworkByChainId(chainId)]),
  );

  let contractData: Omit<ContractConfigData, 'contract'>;

  if (group === 'assets' && Array.isArray(contracts)) {
    const contract = (contracts as AssetDetails[]).find(
      item => item.symbol.toLowerCase() === name.toLowerCase(),
    );

    if (!contract) {
      throw new Error(`getContract: Unknown contract: ${name}`);
    }

    contractData = {
      address: contract.address.toLowerCase(),
      abi: await getContractGroupAbi(group),
    };
  } else {
    const contract: AsyncContractConfigData = get(contracts, name);

    if (!contract) {
      throw new Error(`getContract: Unknown contract: ${name}`);
    }

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
    case 'assets':
      return (await import('../abis/erc20.json')).default;
    case 'loanTokens':
      return (await import('../abis/loanToken.json')).default;
    default:
      throw new Error(`getContractGroupAbi: Unknown group: ${group}`);
  }
};

export const resolveIcon = async (assetBaseDetails: AssetDetails) => {
  const { address, symbol, getIcon } = assetBaseDetails;

  if (iconCache.has(address)) {
    return iconCache.get(address);
  }

  const icon = await getIcon();

  if (!icon) {
    throw new Error(
      `resolveIcon: Icon not found for token: ${symbol} (${address})`,
    );
  }

  iconCache.set(symbol, icon);
  return icon;
};

export const getAsset = async (
  symbol: string,
  chainId: ChainId,
): Promise<AssetDetails> => {
  const items: AssetDetails[] = await import('../contracts').then(m =>
    get(m.contracts, ['assets', getNetworkByChainId(chainId)]),
  );

  const tokenBaseInfo = items.find(
    item => item.symbol.toLowerCase() === symbol.toLowerCase(),
  );

  if (!tokenBaseInfo) {
    throw new Error(`getAssetDetails: Unsupported asset: ${symbol}`);
  }

  tokenBaseInfo.address = tokenBaseInfo.address.toLowerCase();

  return tokenBaseInfo;
};

export const getAssetData = async (
  symbol: string,
  chainId: ChainId,
): Promise<AssetDetailsData> => {
  const tokenBaseInfo = await getAsset(symbol, chainId);
  const { abi, contract } = await getContract(symbol, 'assets', chainId);

  const icon = await resolveIcon(tokenBaseInfo);

  const tokenDetails: AssetDetailsData = {
    ...tokenBaseInfo,
    icon,
    abi,
    contract,
  };

  return tokenDetails;
};

export const getAssetDataByAddress = async (
  address: string,
  chainId: ChainId,
): Promise<AssetDetailsData> => {
  const items: AssetDetails[] = await import('../contracts').then(m =>
    get(m.contracts, ['assets', getNetworkByChainId(chainId)]),
  );

  const tokenBaseInfo = items.find(
    item => item.address.toLowerCase() === address.toLowerCase(),
  );

  if (!tokenBaseInfo) {
    throw new Error(
      `getTokenDetailsDataByAddress: Unsupported asset: ${address}`,
    );
  }

  tokenBaseInfo.address = tokenBaseInfo.address.toLowerCase();

  const icon = await resolveIcon(tokenBaseInfo);

  const { abi } = await findContract(address);

  if (!abi) {
    throw new Error(
      `getTokenDetailsDataByAddress: ABI not found for asset: ${address}`,
    );
  }

  const tokenDetails: AssetDetailsData = {
    ...tokenBaseInfo,
    icon,
    abi,
    contract: (signerOrProvider?: Signer | Provider) =>
      new Contract(address, abi, signerOrProvider),
  };

  return tokenDetails;
};
