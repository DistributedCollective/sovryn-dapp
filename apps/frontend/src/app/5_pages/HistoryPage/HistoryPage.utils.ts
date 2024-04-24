import { ChainId, ChainIds } from '@sovryn/ethers-provider';

import { Chains } from '../../../config/chains';

import { isBobChain, isRskChain } from '../../../utils/chain';
import { IUsesChain } from './HistoryPage.types';

export const isHistoryItemOnChain = (item: IUsesChain, chainId: ChainId) => {
  const isRSK = isRskChain(chainId);
  const isBOB = chainId === ChainIds.SEPOLIA || isBobChain(chainId);
  return (
    (isRSK && item.chains.includes(Chains.RSK)) ||
    (isBOB && item.chains.includes(Chains.BOB))
  );
};
