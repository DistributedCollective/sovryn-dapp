import { defer } from 'react-router-dom';

import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import { decimalic } from '../../../utils/math';
import { getZeroProvider } from './utils/zero-provider';

export type ZeroPageLoaderData = {
  liquity: EthersLiquity;
  provider: ReadableEthersLiquity;
  deferredData: Promise<[string]>;
};

export const zeroPageLoader = async () => {
  const { provider, ethers } = await getZeroProvider();

  return defer({
    liquity: ethers,
    provider,
    deferredData: Promise.all([
      ethers.getPrice().then(result => decimalic(result.toString())),
    ]),
  });
};
