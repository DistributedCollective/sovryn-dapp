import { BigNumber, constants, utils } from 'ethers';

import { ChainId, ChainIds, getProvider } from '@sovryn/ethers-provider';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { EXIT_DELAY_TTL, RELEASE_READ_TIMEOUT_MS } from '../../utils/exitDelay';
import { boundedBy, sendersOf } from './rawCall';

type DeploymentQueue = { address: string; runtimeCodeHash: string };

export type DeploymentQueueRead =
  | { kind: 'none' }
  | { kind: 'known'; address: string }
  | { kind: 'unreadable' };

/** Public release inputs selected by read chain, never by user storage. */
export const configuredDeploymentQueue = (
  chainId: ChainId,
): DeploymentQueue | undefined => {
  const inputs: Record<string, [string | undefined, string | undefined]> = {
    [ChainIds.RSK_MAINNET]: [
      process.env.REACT_APP_PERIMETER_QUEUE_RSK_MAINNET,
      process.env.REACT_APP_PERIMETER_QUEUE_RSK_MAINNET_RUNTIME_HASH,
    ],
    [ChainIds.RSK_TESTNET]: [
      process.env.REACT_APP_PERIMETER_QUEUE_RSK_TESTNET,
      process.env.REACT_APP_PERIMETER_QUEUE_RSK_TESTNET_RUNTIME_HASH,
    ],
  };
  const [address, runtimeCodeHash] = inputs[chainId] ?? [];
  if ((!address || address === constants.AddressZero) && !runtimeCodeHash) {
    return undefined;
  }
  if (
    !address ||
    address === constants.AddressZero ||
    !utils.isAddress(address) ||
    !runtimeCodeHash ||
    !/^0x[0-9a-fA-F]{64}$/.test(runtimeCodeHash)
  ) {
    throw new Error(
      'Perimeter deployment queue requires an address and runtime hash.',
    );
  }
  return {
    address: address.toLowerCase(),
    runtimeCodeHash: runtimeCodeHash.toLowerCase(),
  };
};

/** Validate the code at the queue address; proxy code is not implementation proof. */
export const readDeploymentQueue = async (
  chainId: ChainId,
): Promise<DeploymentQueueRead> => {
  try {
    const configured = configuredDeploymentQueue(chainId);
    if (!configured) return { kind: 'none' };
    return await asyncCall(
      `exitDelay/deployment/${chainId}/${configured.address}/${configured.runtimeCodeHash}`,
      async (): Promise<DeploymentQueueRead> => {
        const provider = getProvider(chainId);
        // Static providers cache getNetwork(). Check the current JSON-RPC
        // backends before using their code response for this deployment.
        const backends = sendersOf(provider);
        if (backends.length === 0) return { kind: 'unreadable' };
        const chains = await Promise.all(
          backends.map(backend =>
            boundedBy(backend.send('eth_chainId', []), RELEASE_READ_TIMEOUT_MS),
          ),
        );
        if (
          chains.some(
            chain =>
              typeof chain !== 'string' ||
              !utils.isHexString(chain) ||
              !BigNumber.from(chain).eq(Number(chainId)),
          )
        ) {
          return { kind: 'unreadable' };
        }
        const code = await boundedBy(
          provider.getCode(configured.address),
          RELEASE_READ_TIMEOUT_MS,
        );
        if (
          code === '0x' ||
          utils.keccak256(code) !== configured.runtimeCodeHash
        ) {
          return { kind: 'unreadable' };
        }
        return { kind: 'known', address: configured.address };
      },
      { ttl: EXIT_DELAY_TTL },
    );
  } catch {
    return { kind: 'unreadable' };
  }
};
