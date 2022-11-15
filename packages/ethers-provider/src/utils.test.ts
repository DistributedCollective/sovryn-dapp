import { ChainIds } from './chains';
import { getChainIdByNetwork, getNetworkByChainId } from './utils';

describe('utils/utils.ts', () => {
  describe('getNetworkByChainId', () => {
    it('should return requested network name', () => {
      expect(getNetworkByChainId(ChainIds.MAINNET)).toBe('eth');
      expect(getNetworkByChainId(ChainIds.RSK_MAINNET)).toBe('rsk');
      expect(getNetworkByChainId(ChainIds.ROPSTEN)).toBe('ropsten');
      expect(getNetworkByChainId(ChainIds.RSK_TESTNET)).toBe('rskTestnet');
    });

    it('should throw error for unsupported network chain id', () => {
      expect(() => getNetworkByChainId('0x0')).toThrowError(
        'Unknown chainId: 0x0',
      );
    });
  });

  describe('getChainIdByNetwork', () => {
    it('should return requested network chain id', () => {
      expect(getChainIdByNetwork('eth')).toBe(ChainIds.MAINNET);
      expect(getChainIdByNetwork('rsk')).toBe(ChainIds.RSK_MAINNET);
      expect(getChainIdByNetwork('ropsten')).toBe(ChainIds.ROPSTEN);
      expect(getChainIdByNetwork('rskTestnet')).toBe(ChainIds.RSK_TESTNET);
    });

    it('should throw error for unsupported network name', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => getChainIdByNetwork('ethereum')).toThrowError(
        'Unknown network: ethereum',
      );
    });
  });
});
