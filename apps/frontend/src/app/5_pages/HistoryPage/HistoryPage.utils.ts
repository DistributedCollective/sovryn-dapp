import { ChainId, ChainIds } from '@sovryn/ethers-provider';

import { Chains } from '../../../config/chains';

import { isBobChain, isRskChain } from '../../../utils/chain';
import { UsesChain } from './HistoryPage.types';

export const isHistoryItemOnChain = (item: UsesChain, chainId: ChainId) => {
  const isRsk = isRskChain(chainId);
  const isBob = chainId === ChainIds.SEPOLIA || isBobChain(chainId);
  return (
    (isRsk && item.chains.includes(Chains.RSK)) ||
    (isBob && item.chains.includes(Chains.BOB))
  );
};
