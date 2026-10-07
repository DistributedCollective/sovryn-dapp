import { act, renderHook } from '@testing-library/react';

import { providers, utils } from 'ethers';

import { sendOrSimulateTx } from '../../app/3_organisms/TransactionStepDialog/utils';
import { useExecuteExit, useExecuteExits } from './useExecuteExit';

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const OTHER = '0x3333333333333333333333333333333333333333';
const QUEUE = '0x2222222222222222222222222222222222222222';
const ABI = new utils.Interface([
  'function executeExit(uint256 requestId)',
  'function executeExits(uint256[] ids)',
]);

let mockSigner: providers.JsonRpcSigner;
const mockSetTransactions = jest.fn();

jest.mock('../useAccount', () => ({
  useAccount: () => ({ signer: mockSigner }),
}));
jest.mock('../../config/chains', () => ({ RSK_CHAIN_ID: '0x1e' }));
jest.mock('../../contexts/TransactionContext', () => ({
  useTransactionContext: () => ({
    setTransactions: (...args: unknown[]) => mockSetTransactions(...args),
    setIsOpen: () => undefined,
    setTitle: () => undefined,
  }),
}));
jest.mock('nanoid', () => ({ nanoid: () => 'fixture' }));
jest.mock('@sovryn/ui', () => ({ NotificationType: {}, StatusType: {} }));
jest.mock('../../utils/simulator/simulateTx', () => ({
  simulateTx: () => {
    throw new Error('Simulation is outside this fixture');
  },
}));

type WalletRequest = {
  from: string;
  to: string;
  data: string;
  value: string;
  chainId?: string;
};

const wallet = async (change: 'none' | 'chain' | 'account') => {
  let chain = '0x1e';
  let account = ACCOUNT;
  const requests: WalletRequest[] = [];
  const accepted: WalletRequest[] = [];
  const provider = new providers.Web3Provider({
    request: async ({ method, params }) => {
      if (method === 'eth_chainId') return chain;
      if (method === 'eth_accounts') return [account];
      if (method === 'eth_getTransactionCount') return '0x0';
      if (method === 'eth_blockNumber') return '0x64';
      if (method === 'eth_sendTransaction') {
        const transaction = (params as WalletRequest[])[0];
        requests.push(transaction);
        if (change === 'chain') chain = '0x1';
        if (change === 'account') account = OTHER;
        if (transaction.from.toLowerCase() !== account.toLowerCase()) {
          throw new Error('Account refused');
        }
        if (transaction.chainId && transaction.chainId !== chain) {
          throw new Error('Chain refused');
        }
        accepted.push(transaction);
        // Capture the real wallet request without fabricating a mined receipt.
        throw new Error('Captured without broadcast');
      }
      throw new Error(`Unexpected fixture method: ${method}`);
    },
  });
  await provider.getNetwork();
  mockSigner = provider.getSigner(ACCOUNT);
  return { provider, requests, accepted };
};

describe('Perimeter release wallet intent', () => {
  beforeEach(() => {
    process.env.REACT_APP_SIMULATE_TX = 'false';
  });

  it.each([false, true])(
    'pins the actual wallet request for batch=%s',
    async batch => {
      const fixture = await wallet('none');
      const originalSend = mockSigner.sendTransaction;
      const { result } = renderHook(() => ({
        single: useExecuteExit(),
        batch: useExecuteExits(),
      }));
      const ids = batch ? ['7', '9'] : ['7'];
      const onComplete = jest.fn();
      const options = {
        preflight: async () => ({
          requestIds: ids,
          gasLimit: '300000',
          from: ACCOUNT,
        }),
        onComplete,
      };
      await act(async () => {
        if (batch)
          await result.current.batch(
            [{ queueAddress: QUEUE, requestIds: ids }],
            options,
          );
        else await result.current.single(QUEUE, '7', options);
      });
      const step = mockSetTransactions.mock.calls[0][0][0];
      const checked = await step.beforeSend({
        config: { gasLimit: '300000', gasPrice: '0.06' },
      });
      await expect(
        sendOrSimulateTx(checked.request, checked.request.args, checked.config),
      ).rejects.toThrow('Captured without broadcast');
      expect(fixture.requests).toEqual([
        expect.objectContaining({
          chainId: '0x1e',
          from: ACCOUNT,
          to: QUEUE,
          value: '0x0',
          data: ABI.encodeFunctionData(
            batch ? 'executeExits' : 'executeExit',
            batch ? [ids] : ['7'],
          ),
        }),
      ]);
      expect(mockSigner.sendTransaction).toBe(originalSend);
      expect(checked.request.contract.signer).not.toBe(mockSigner);
      expect(onComplete).not.toHaveBeenCalled();
      step.onComplete();
      expect(onComplete).toHaveBeenCalledTimes(1);
      if (batch)
        expect(onComplete).toHaveBeenCalledWith({
          queueAddress: QUEUE,
          requestIds: ids,
        });
      fixture.provider.removeAllListeners();
    },
  );

  it.each(['chain', 'account'] as const)(
    'allows the wallet to refuse a late %s switch',
    async change => {
      const fixture = await wallet(change);
      const { result } = renderHook(() => useExecuteExit());
      await act(async () => {
        await result.current(QUEUE, '7', {
          preflight: async () => ({
            requestIds: ['7'],
            gasLimit: '300000',
            from: ACCOUNT,
          }),
        });
      });
      const step = mockSetTransactions.mock.calls[0][0][0];
      const checked = await step.beforeSend({ config: { gasPrice: '0.06' } });
      await expect(
        sendOrSimulateTx(checked.request, checked.request.args, checked.config),
      ).rejects.toThrow(
        change === 'chain' ? 'Chain refused' : 'Account refused',
      );
      expect(fixture.requests).toHaveLength(1);
      expect(fixture.accepted).toHaveLength(0);
      fixture.provider.removeAllListeners();
    },
  );
});
