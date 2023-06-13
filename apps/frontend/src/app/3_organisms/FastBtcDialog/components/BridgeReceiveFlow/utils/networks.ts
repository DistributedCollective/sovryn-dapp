import { ChainIds } from '@sovryn/ethers-provider';

import { isMainnet } from '../../../../../../utils/helpers';
import { OriginNetwork } from '../../../contexts/receive-context';

type NetworkDetails = {
  label: string;
  chainId: ChainIds;
};

export const networks: Partial<Record<OriginNetwork, NetworkDetails>> = {
  [OriginNetwork.ETHEREUM]: {
    label: 'Ethereum',
    chainId: isMainnet() ? ChainIds.MAINNET : ChainIds.SEPOLIA,
  },
  [OriginNetwork.BINANCE_SMART_CHAIN]: {
    label: 'BNB Smart Chain',
    chainId: isMainnet() ? ChainIds.BSC_MAINNET : ChainIds.BSC_TESTNET,
  },
} as const;

export const getNetwork = (originNetwork: OriginNetwork) =>
  networks[originNetwork] as NetworkDetails;
