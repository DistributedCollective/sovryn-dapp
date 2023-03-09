import { defer } from 'react-router-dom';

import { Fees } from '@sovryn-zero/lib-base';
import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import { getZeroProvider } from './utils/zero-provider';

export type ZeroPageLoaderData = {
  liquity: EthersLiquity;
  provider: ReadableEthersLiquity;
  deferedData: Promise<[string, Fees]>;
};

export const zeroPageLoader = async () => {
  const { provider, ethers } = await getZeroProvider();

  return defer({
    liquity: ethers,
    provider,
    deferedData: Promise.all([
      ethers.getPrice().then(result => result.toString()),
      ethers.getFees(),
    ]),
  });
};
