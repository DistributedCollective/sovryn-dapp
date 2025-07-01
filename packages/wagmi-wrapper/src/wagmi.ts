import { createConfig, http } from 'wagmi';
import { rootstock, rootstockTestnet, bob, bobSepolia } from 'wagmi/chains';

export const createWagmiConfig = () => {
  return createConfig({
    chains: [rootstock, rootstockTestnet, bob, bobSepolia],
    transports: {
      [rootstock.id]: http(),
      [rootstockTestnet.id]: http(),
      [bob.id]: http(),
      [bobSepolia.id]: http(),
    },
  });
};
