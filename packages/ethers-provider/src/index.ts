import { getProvider } from './provider';
import { state } from './store';
import { addChains, updateChain } from './store/actions';
import { Chain } from './types';

export { ChainIds } from './chains';
export * from './types';

const API = {
  getProvider,
  addChains,
  updateChain,
  chains: () => state.get().chains,
  observe: state.select('chains'),
};

export type SovrynEthersProvider = typeof API;

function init(initialChains: Chain[]): SovrynEthersProvider {
  addChains(initialChains);
  return API;
}

export default init;
export { getProvider };
