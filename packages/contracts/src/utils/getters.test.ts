import { ChainIds } from '@sovryn/ethers-provider';

import { contracts } from '../contracts';
import {
  getLendTokenContract,
  getLoanTokenContract,
  getProtocolContract,
  getTokenContract,
  getZeroContract,
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

  describe('getLendTokenContract', () => {
    it('load lowercased dllr lend token contract address', async () => {
      const token = await getLendTokenContract('dllr');
      expect(token.address).toBe(
        contracts.lendTokens.rsk?.dllr.address.toLowerCase(),
      );
    });

    it('loads lowercased dllr lend token contract from non default chain', async () => {
      const token = await getLendTokenContract('dllr', ChainIds.RSK_TESTNET);
      expect(token.address).toBe(
        contracts.lendTokens.rskTestnet?.dllr.address.toLowerCase(),
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

  describe('getZeroContract', () => {
    it('load lowercased borrowerOperations contract address', async () => {
      const contract = await getZeroContract('borrowerOperations');
      expect(contract.address).toBe(
        contracts.zero.rsk?.borrowerOperations.address.toLowerCase(),
      );
    });
  });
});
