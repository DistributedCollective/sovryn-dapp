import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';

import { translations } from '../../../../locales/i18n';
import { isMainnet } from '../../../../utils/helpers';
import { OriginNetwork } from '../types';

type NetworkDetails = {
  label: OriginNetwork;
  chainId: ChainIds;
};

export const networks: Partial<Record<OriginNetwork, NetworkDetails>> = {
  [OriginNetwork.BITCOIN]: {
    label: t(translations.common.networks.bitcoin),
    chainId: isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET,
  },
  [OriginNetwork.ETHEREUM]: {
    label: t(translations.common.networks.ethereum),
    chainId: isMainnet() ? ChainIds.MAINNET : ChainIds.SEPOLIA,
  },
  [OriginNetwork.BINANCE_SMART_CHAIN]: {
    label: t(translations.common.networks.bnb),
    chainId: isMainnet() ? ChainIds.BSC_MAINNET : ChainIds.BSC_TESTNET,
  },
} as const;

export const getNetwork = (originNetwork: OriginNetwork) =>
  networks[originNetwork] as NetworkDetails;
