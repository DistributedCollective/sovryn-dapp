import { SupportedTokens } from '@sovryn/contracts';

import { Chains } from '../../../config/chains';
import { currentNetwork } from '../../../utils/helpers';
import { contracts, FastBTCWithdrawContractName } from './config/contracts';

export const getBTCAssetForNetwork = (network: Chains) => SupportedTokens.rbtc; // RBTC is only BTC asset as we don't support other chains for now

export const getFastBTCWithdrawalContract = (
  chain: Chains = Chains.RSK,
  contractName: FastBTCWithdrawContractName,
) => {
  const contract = contracts[contractName];
  if (!contract) {
    throw new Error(
      `Contract ${contractName} does not exist for fast-btc withdrawals.`,
    );
  }

  if (!contract.address?.[chain]?.[currentNetwork]) {
    throw new Error(
      `Contract ${contractName} does is not defined for ${chain} on ${currentNetwork}`,
    );
  }

  return {
    address: contract.address[chain]?.[currentNetwork] as string,
    abi: contract.abi,
  };
};
