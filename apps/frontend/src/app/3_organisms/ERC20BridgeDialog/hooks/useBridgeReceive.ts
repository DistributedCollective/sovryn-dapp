import { useQuery } from '@tanstack/react-query';

import { useCallback, useState, useEffect } from 'react';

import { ethers } from 'ethers';

import { ChainIds } from '@sovryn/ethers-provider';

import { useBridgeService } from './useBridgeService';

interface BridgeEvent {
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  token: string;
  amount: string;
  userData: string;
  timestamp?: number;
  sourceChain?: ChainIds;
  status: 'pending' | 'confirmed' | 'failed';
}

interface UseBridgeReceiveParams {
  targetChain: ChainIds;
  receiver: string;
  fromBlock?: number;
  toBlock?: number;
}

interface UseBridgeReceiveReturn {
  incomingTransfers: BridgeEvent[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  trackTransaction: (txHash: string, sourceChain: ChainIds) => void;
  hasMore: boolean;
  loadMore: () => void;
}

const BRIDGE_ABI_EVENTS = [
  'event Cross(address indexed _tokenAddress, address indexed _to, uint256 _amount, bytes _userData)',
  'event CrossToken(address _tokenAddress, address indexed _from, address indexed _to, uint _amount, bytes _userData)',
];

export function useBridgeReceive({
  targetChain,
  receiver,
  fromBlock = 0,
  toBlock,
}: UseBridgeReceiveParams): UseBridgeReceiveReturn {
  const bridgeService = useBridgeService();
  const [manualTrackedTxs, setManualTrackedTxs] = useState<
    Map<string, ChainIds>
  >(new Map());
  const [currentFromBlock, setCurrentFromBlock] = useState(fromBlock);
  const [allTransfers, setAllTransfers] = useState<BridgeEvent[]>([]);

  const PAGE_SIZE = 1000;

  const possibleSourceChains = useCallback(() => {
    if (!bridgeService) return [];

    const allChains = [
      ChainIds.RSK_MAINNET,
      ChainIds.RSK_TESTNET,
      ChainIds.MAINNET,
      ChainIds.ROPSTEN,
      ChainIds.BSC_MAINNET,
      ChainIds.BSC_TESTNET,
    ];

    // for (const chain of allChains) {
    //   const supportedTargets = bridgeService.getSupportedTargetChains(chain);
    //   if (supportedTargets.includes(targetChain)) {
    //     chains.push(chain);
    //   }
    // }

    return allChains;
  }, [bridgeService]);

  const {
    data: transfers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'bridgeReceive',
      targetChain,
      receiver,
      currentFromBlock,
      toBlock,
    ],
    queryFn: async () => {
      if (!bridgeService) throw new Error('Bridge service not initialized');

      const events: BridgeEvent[] = [];
      const provider = bridgeService['getProvider'](targetChain);

      const latestBlock = toBlock || (await provider.getBlockNumber());
      const queryToBlock = Math.min(
        currentFromBlock + PAGE_SIZE - 1,
        latestBlock,
      );

      const sourceChains = possibleSourceChains();

      for (const sourceChain of sourceChains) {
        const bridgeConfig = bridgeService.getBridgeConfig(
          sourceChain,
          targetChain,
        );
        if (!bridgeConfig) continue;

        const bridgeContract = new ethers.Contract(
          bridgeConfig.bridgeContractAddress,
          BRIDGE_ABI_EVENTS,
          provider,
        );

        const crossFilter = bridgeContract.filters.Cross(null, receiver);
        const crossEvents = await bridgeContract.queryFilter(
          crossFilter,
          currentFromBlock,
          queryToBlock,
        );

        const crossTokenFilter = bridgeContract.filters.CrossToken(
          null,
          null,
          receiver,
        );
        const crossTokenEvents = await bridgeContract.queryFilter(
          crossTokenFilter,
          currentFromBlock,
          queryToBlock,
        );

        for (const event of [...crossEvents, ...crossTokenEvents]) {
          const block = await provider.getBlock(event.blockNumber);

          events.push({
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            from: event.args?._from || event.address,
            to: event.args?._to,
            token: event.args?._tokenAddress || ethers.constants.AddressZero,
            amount: event.args?._amount.toString(),
            userData: event.args?._userData || '0x',
            timestamp: block.timestamp,
            sourceChain,
            status: 'confirmed',
          });
        }
      }

      for (const [txHash, sourceChain] of manualTrackedTxs.entries()) {
        try {
          const receipt = await bridgeService.getTransactionStatus(
            sourceChain,
            txHash,
          );
          if (receipt) {
            const sourceBlock = await provider.getBlock(receipt.blockNumber);

            const bridgeConfig = bridgeService.getBridgeConfig(
              sourceChain,
              targetChain,
            );
            if (bridgeConfig) {
              const bridgeContract = new ethers.Contract(
                bridgeConfig.bridgeContractAddress,
                BRIDGE_ABI_EVENTS,
                provider,
              );

              const parsedLogs = receipt.logs
                .map(log => {
                  try {
                    return bridgeContract.interface.parseLog(log);
                  } catch {
                    return null;
                  }
                })
                .filter(Boolean);

              for (const log of parsedLogs) {
                if (
                  log &&
                  (log.name === 'Cross' || log.name === 'CrossToken')
                ) {
                  events.push({
                    blockNumber: receipt.blockNumber,
                    transactionHash: txHash,
                    from: log.args._from || receipt.from,
                    to: log.args._to,
                    token:
                      log.args._tokenAddress || ethers.constants.AddressZero,
                    amount: log.args._amount.toString(),
                    userData: log.args._userData || '0x',
                    timestamp: sourceBlock.timestamp,
                    sourceChain,
                    status: receipt.status === 1 ? 'confirmed' : 'failed',
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error checking tx ${txHash}:`, error);
        }
      }

      return events;
    },
    enabled: !!bridgeService && !!receiver,
    refetchInterval: 30_000,
  });

  const trackTransaction = useCallback(
    (txHash: string, sourceChain: ChainIds) => {
      setManualTrackedTxs(prev => new Map(prev).set(txHash, sourceChain));
    },
    [],
  );

  const hasMore = useCallback(() => {
    if (!bridgeService || isLoading) return false;

    const provider = bridgeService['getProvider'](targetChain);
    return provider
      .getBlockNumber()
      .then(latest => {
        const queryToBlock = toBlock || latest;
        return currentFromBlock + PAGE_SIZE < queryToBlock;
      })
      .catch(() => false);
  }, [bridgeService, targetChain, currentFromBlock, toBlock, isLoading]);

  const loadMore = useCallback(() => {
    if (!isLoading) {
      setCurrentFromBlock(prev => prev + PAGE_SIZE);
    }
  }, [isLoading]);

  useEffect(() => {
    if (transfers) {
      setAllTransfers(prev => {
        const txMap = new Map(prev.map(t => [t.transactionHash, t]));
        transfers.forEach(t => txMap.set(t.transactionHash, t));
        return Array.from(txMap.values()).sort(
          (a, b) => b.blockNumber - a.blockNumber,
        );
      });
    }
  }, [transfers]);

  return {
    incomingTransfers: allTransfers,
    isLoading,
    error: error as Error | null,
    refetch,
    trackTransaction,
    hasMore: hasMore(),
    loadMore,
  };
}
