import { ChainIds } from '@sovryn/ethers-provider';

import erc20 from '../abis/erc20.json';
import loanToken from '../abis/loanToken.json';
import { contracts } from '../contracts';
import { findContract, getContract, getContractGroupAbi } from './global';

const RSK_XUSD_ADDRESS = contracts.assets.rsk?.find(
  item => item.symbol === 'XUSD',
)?.address!;
const RSK_SWAP_NETWORK = contracts.protocol.rsk?.swapNetwork.address!;

describe('utils/contracts/global.ts', () => {
  describe('findContract', () => {
    it('finds token contract by address', async () => {
      const token = await findContract(RSK_XUSD_ADDRESS);
      expect(token.address).toBe(RSK_XUSD_ADDRESS.toLowerCase());
      expect(token.chainId).toBe(ChainIds.RSK_MAINNET);
      expect(token.group).toBe('assets');
      expect(token.name).toBe('XUSD');
    });

    it('finds protocol contract by address', async () => {
      const contract = await findContract(RSK_SWAP_NETWORK);
      expect(contract.address).toBe(RSK_SWAP_NETWORK.toLowerCase());
      expect(contract.chainId).toBe(ChainIds.RSK_MAINNET);
      expect(contract.group).toBe('protocol');
      expect(contract.name).toBe('swapNetwork');
    });

    it('second contract search returns cached item', async () => {
      const token1 = await findContract(RSK_XUSD_ADDRESS);
      const token2 = await findContract(RSK_XUSD_ADDRESS);
      expect(token1).toBe(token2);
    });

    it('throws error if contract is unknown', async () => {
      expect.assertions(1);
      try {
        await findContract('0x0000000000000000000000000000000000000001');
      } catch (e) {
        expect(e.message).toBe(
          'findContract: Unknown contract: 0x0000000000000000000000000000000000000001',
        );
      }
    });
  });

  describe('getContract', () => {
    it('gets xusd contract', async () => {
      const token = await getContract('xusd', 'assets', ChainIds.RSK_MAINNET);
      expect(token.address).toBe(RSK_XUSD_ADDRESS.toLowerCase());
    });

    it('caches second xusd contract call', async () => {
      const token1 = await getContract('xusd', 'assets', ChainIds.RSK_MAINNET);
      const token2 = await getContract('xusd', 'assets', ChainIds.RSK_MAINNET);
      expect(token1).toBe(token2);
    });

    it('throws error if contract is unknown', async () => {
      expect.assertions(1);
      try {
        await getContract('xusdtest', 'loanTokens', ChainIds.RSK_MAINNET);
      } catch (e) {
        expect(e.message).toBe('getContract: Unknown contract: xusdtest');
      }
    });
  });

  describe('getContractGroupAbi', () => {
    it('loads token contract abi', async () => {
      const abi = await getContractGroupAbi('assets');
      expect(abi).toBe(erc20);
    });

    it('loads loan token contract abi', async () => {
      const abi = await getContractGroupAbi('loanTokens');
      expect(abi).toBe(loanToken);
    });

    it('fails to load unkown contract group', async () => {
      expect.assertions(1);
      try {
        await getContractGroupAbi('protocol');
      } catch (e) {
        expect(e.message).toBe('getContractGroupAbi: Unknown group: protocol');
      }
    });
  });
});
