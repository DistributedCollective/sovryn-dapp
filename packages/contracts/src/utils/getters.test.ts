import { ChainIds } from '@sovryn/ethers-provider';

import { contracts } from '../contracts';
import {
  getAssetContract,
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
      const token = await getLoanTokenContract('XUSD');
      expect(token.address).toBe(
        contracts.loanTokens.rsk?.XUSD.address.toLowerCase(),
      );
    });

    it('loads lowercased xusd loan token contract from non default chain', async () => {
      const token = await getLoanTokenContract('XUSD', ChainIds.RSK_TESTNET);
      expect(token.address).toBe(
        contracts.loanTokens.rskTestnet?.XUSD.address.toLowerCase(),
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
