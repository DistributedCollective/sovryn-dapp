import { ChainIds } from '@sovryn/ethers-provider';

import { contracts } from '../../config/contracts';
import {
  getLoanTokenContract,
  getProtocolContract,
  getTokenContract,
} from './getters';

describe('utils/contracts/getters.ts', () => {
  describe('getTokenContract', () => {
    it('load lowercased xusd token contract address', async () => {
      const token = await getTokenContract('xusd');
      expect(token.address).toBe(contracts.tokens.rsk?.xusd.toLowerCase());
    });

    it('loads lowercased xusd token contract from non default chain', async () => {
      const token = await getTokenContract('xusd', ChainIds.RSK_TESTNET);
      expect(token.address).toBe(
        contracts.tokens.rskTestnet?.xusd.toLowerCase(),
      );
    });
  });

  describe('getLoanTokenContract', () => {
    it('load lowercased xusd loan token contract address', async () => {
      const token = await getLoanTokenContract('ixusd');
      expect(token.address).toBe(contracts.loanTokens.rsk?.ixusd.toLowerCase());
    });

    it('loads lowercased xusd loan token contract from non default chain', async () => {
      const token = await getLoanTokenContract('ixusd', ChainIds.RSK_TESTNET);
      expect(token.address).toBe(
        contracts.loanTokens.rskTestnet?.ixusd.toLowerCase(),
      );
    });
  });

  describe('getProtocolContract', () => {
    it('load lowercased xusd loan token contract address', async () => {
      const token = await getProtocolContract('swapNetwork');
      expect(token.address).toBe(
        contracts.protocol.rsk?.swapNetwork.address.toLowerCase(),
      );
    });
  });
});
