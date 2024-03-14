import { ChainIds } from '@sovryn/ethers-provider';

import { contracts } from '../contracts';
import {
  getAssetContract,
  getLendTokenContract,
  getLoanTokenContract,
  getProtocolContract,
  getZeroContract,
} from './getters';

describe('utils/contracts/getters.ts', () => {
  describe('getAssetContract', () => {
    it('load lowercased xusd token contract address', async () => {
      const token = await getAssetContract('xusd');
      expect(token.address).toBe(
        contracts.assets.rsk
          ?.find(item => item.symbol === 'XUSD')
          ?.address.toLowerCase(),
      );
    });

    it('loads lowercased xusd token contract from non default chain', async () => {
      const token = await getAssetContract('xusd', ChainIds.RSK_TESTNET);
      expect(token.address).toBe(
        contracts.assets.rskTestnet
          ?.find(item => item.symbol === 'XUSD')
          ?.address.toLowerCase(),
      );
    });
  });

  describe('getLoanTokenContract', () => {
    it('load lowercased xusd loan token contract address', async () => {
      const token = await getLoanTokenContract('xusd');
      expect(token.address).toBe(
        contracts.loanTokens.rsk?.xusd.address.toLowerCase(),
      );
    });

    it('loads lowercased xusd loan token contract from non default chain', async () => {
      const token = await getLoanTokenContract('xusd', ChainIds.RSK_TESTNET);
      expect(token.address).toBe(
        contracts.loanTokens.rskTestnet?.xusd.address.toLowerCase(),
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
