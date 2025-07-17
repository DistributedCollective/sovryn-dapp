import { ethers } from 'ethers';

import { ChainIds } from '@sovryn/ethers-provider';

import ALLOW_TOKENS_ABI from './abis/allowTokens.json';
import BRIDGE_ABI from './abis/bridge.json';
import ERC20_ABI from './abis/erc20.json';
import { getBridge, getSupportedTargetChains } from './config/bridges';
import { getNetwork } from './config/networks';
import {
  CrossBridgeAsset,
  BridgeDepositParams,
  BridgeLimits,
  AssetConfig,
  Environments,
  NetworkConfig,
  BridgeConfig,
} from './types';

export class BridgeService {
  private providers: Map<ChainIds, ethers.providers.JsonRpcProvider> =
    new Map();
  private signers: Map<ChainIds, ethers.Signer> = new Map();
  private mode: Environments;

  constructor(isMainnet = true) {
    this.mode = isMainnet ? Environments.MAINNET : Environments.TESTNET;
  }

  // Initialize provider for a specific chain
  initProvider(
    chain: ChainIds,
    providerOrSigner: ethers.providers.Provider | ethers.Signer,
  ) {
    if (ethers.Signer.isSigner(providerOrSigner)) {
      this.signers.set(chain, providerOrSigner);
      this.providers.set(
        chain,
        providerOrSigner.provider as ethers.providers.JsonRpcProvider,
      );
    } else {
      this.providers.set(
        chain,
        providerOrSigner as ethers.providers.JsonRpcProvider,
      );
    }
  }

  private getProvider(chain: ChainIds): ethers.providers.JsonRpcProvider {
    const provider = this.providers.get(chain);
    if (!provider) {
      throw new Error(`Provider not initialized for chain ${chain}`);
    }
    return provider;
  }

  // Get signer for chain
  private getSigner(chain: ChainIds): ethers.Signer {
    const signer = this.signers.get(chain);
    if (!signer) {
      throw new Error(`Signer not initialized for chain ${chain}`);
    }
    return signer;
  }

  // Get supported target chains for a source chain
  getSupportedTargetChains(sourceChain: ChainIds): ChainIds[] {
    return getSupportedTargetChains(sourceChain, this.mode);
  }

  // Get bridge configuration
  getBridgeConfig(
    sourceChain: ChainIds,
    targetChain: ChainIds,
  ): BridgeConfig | undefined {
    return getBridge(sourceChain, targetChain, this.mode);
  }

  // Get network configuration
  getNetworkConfig(chain: ChainIds): NetworkConfig | undefined {
    return getNetwork(chain, this.mode);
  }

  // Get asset configuration
  getAssetConfig(
    sourceChain: ChainIds,
    targetChain: ChainIds,
    asset: CrossBridgeAsset,
  ): AssetConfig | undefined {
    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    return bridge?.assets.find(a => a.asset === asset);
  }

  // Get assets by source chain
  getAssetsBySourceChain(sourceChain: ChainIds) {
    const supportedChains = this.getSupportedTargetChains(sourceChain);
    const assets: AssetConfig[] = [];

    for (const targetChain of supportedChains) {
      const bridge = this.getBridgeConfig(sourceChain, targetChain);
      if (bridge) {
        assets.push(
          ...bridge.assets.filter(asset => asset.fromChainId === sourceChain),
        );
      }
    }

    return assets.map(asset => ({
      ...asset,
      id: `${asset.symbol}-${asset.toChainId}`,
    }));
  }

  // Get assets by target chain
  getAssetsByTargetChain(targetChain: ChainIds) {
    const assets: AssetConfig[] = [];

    // Get all possible source chains that can bridge to the target chain
    const allChains = Object.values(ChainIds);

    for (const sourceChain of allChains) {
      const bridge = this.getBridgeConfig(sourceChain, targetChain);
      if (bridge) {
        assets.push(
          ...bridge.assets.filter(asset => asset.toChainId === targetChain),
        );
      }
    }

    return assets.map(asset => ({
      ...asset,
      id: `${asset.symbol}-${asset.toChainId}`,
    }));
  }

  // Get token balance
  async getBalance(
    chain: ChainIds,
    asset: CrossBridgeAsset,
    address: string,
  ): Promise<string> {
    const provider = this.getProvider(chain);
    const assetConfig = this.getAssetForChain(chain, asset);

    if (!assetConfig) {
      throw new Error(`Asset ${asset} not found for chain ${chain}`);
    }

    if (assetConfig.isNative) {
      return (await provider.getBalance(address)).toString();
    }

    const token = new ethers.Contract(
      assetConfig.tokenContractAddress,
      ERC20_ABI,
      provider,
    );

    return (await token.balanceOf(address)).toString();
  }

  // Get allowance
  async getAllowance(
    chain: ChainIds,
    asset: CrossBridgeAsset,
    owner: string,
    spender: string,
  ): Promise<string> {
    const assetConfig = this.getAssetForChain(chain, asset);

    if (!assetConfig || assetConfig.isNative) {
      return ethers.constants.MaxUint256.toString();
    }

    const provider = this.getProvider(chain);
    const token = new ethers.Contract(
      assetConfig.tokenContractAddress,
      ERC20_ABI,
      provider,
    );

    return (await token.allowance(owner, spender)).toString();
  }

  // Get bridge limits
  async getBridgeLimits(
    sourceChain: ChainIds,
    targetChain: ChainIds,
    asset: CrossBridgeAsset,
  ): Promise<BridgeLimits> {
    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    const assetConfig = this.getAssetConfig(sourceChain, targetChain, asset);

    if (!bridge || !assetConfig) {
      throw new Error('Bridge or asset configuration not found');
    }

    const provider = this.getProvider(sourceChain);
    const bridgeContract = new ethers.Contract(
      bridge.bridgeContractAddress,
      BRIDGE_ABI,
      provider,
    );
    const allowTokensContract = new ethers.Contract(
      bridge.allowTokensContractAddress,
      ALLOW_TOKENS_ABI,
      provider,
    );

    const [spentToday, dailyLimit, minPerToken, feePerToken, maxTokensAllowed] =
      await Promise.all([
        bridgeContract.spentToday(),
        allowTokensContract.dailyLimit(),
        allowTokensContract.getMinPerToken(
          assetConfig.bridgeTokenAddress || assetConfig.tokenContractAddress,
        ),
        allowTokensContract.getFeePerToken(
          assetConfig.bridgeTokenAddress || assetConfig.tokenContractAddress,
        ),
        allowTokensContract.getMaxTokensAllowed(),
      ]);

    return {
      spentToday: spentToday.toString(),
      dailyLimit: dailyLimit.toString(),
      minPerToken: minPerToken.toString(),
      feePerToken: feePerToken.toString(),
      maxTokensAllowed: maxTokensAllowed.toString(),
    };
  }

  // Approve tokens
  async approve(
    chain: ChainIds,
    asset: CrossBridgeAsset,
    spender: string,
    amount: string,
  ): Promise<ethers.ContractTransaction> {
    const assetConfig = this.getAssetForChain(chain, asset);

    if (!assetConfig || assetConfig.isNative) {
      throw new Error('Cannot approve native asset');
    }

    const signer = this.getSigner(chain);
    const token = new ethers.Contract(
      assetConfig.tokenContractAddress,
      ERC20_ABI,
      signer,
    );

    // Special handling for USDT on Ethereum
    if (
      asset === CrossBridgeAsset.USDT &&
      [ChainIds.MAINNET, ChainIds.ROPSTEN].includes(chain)
    ) {
      const currentAllowance = await token.allowance(
        await signer.getAddress(),
        spender,
      );
      if (!currentAllowance.isZero()) {
        // Reset allowance to 0 first
        const resetTx = await token.approve(spender, 0);

        await resetTx.wait();
      }
    }

    return token.approve(spender, amount);
  }

  // Deposit tokens to bridge
  async deposit(
    params: BridgeDepositParams,
  ): Promise<ethers.ContractTransaction> {
    const { sourceChain, targetChain, asset, amount, receiver } = params;

    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    const assetConfig = this.getAssetConfig(sourceChain, targetChain, asset);

    if (!bridge || !assetConfig) {
      throw new Error('Bridge or asset configuration not found');
    }

    const signer = this.getSigner(sourceChain);
    const sender = await signer.getAddress();
    const bridgeContract = new ethers.Contract(
      bridge.bridgeContractAddress,
      BRIDGE_ABI,
      signer,
    );

    // For native assets
    if (assetConfig.isNative) {
      return bridgeContract.receiveEthAt(receiver || sender, '0x', {
        value: amount,
      });
    }

    // For token transfers
    return bridgeContract.receiveTokensAt(
      assetConfig.bridgeTokenAddress || assetConfig.tokenContractAddress,
      amount,
      receiver || sender,
      '0x',
    );
  }

  // Get transaction status
  async getTransactionStatus(
    chain: ChainIds,
    txHash: string,
  ): Promise<ethers.providers.TransactionReceipt> {
    const provider = this.getProvider(chain);
    return provider.getTransactionReceipt(txHash);
  }

  async getTransactionHistory(
    chain: ChainIds,
    address: string,
    limit = 10,
  ): Promise<ethers.providers.TransactionResponse[]> {
    const provider = this.getProvider(chain);
    const blockNumber = await provider.getBlockNumber();
    const transactions: ethers.providers.TransactionResponse[] = [];

    for (let i = blockNumber; i >= 0 && transactions.length < limit; i--) {
      const block = await provider.getBlockWithTransactions(i);
      const relevantTxs = block.transactions.filter(
        tx => tx.from?.toLowerCase() === address.toLowerCase(),
      );
      transactions.push(...relevantTxs);
    }

    return transactions.slice(0, limit);
  }

  private getAssetForChain(
    sourceChain: ChainIds,
    asset: CrossBridgeAsset,
  ): AssetConfig | undefined {
    const supportedChains = this.getSupportedTargetChains(sourceChain);
    for (const targetChain of supportedChains) {
      const config = this.getAssetConfig(sourceChain, targetChain, asset);
      if (config) {
        return config;
      }
    }
    return undefined;
  }

  // Estimate gas for depositx
  async estimateDepositGas(
    params: BridgeDepositParams,
  ): Promise<ethers.BigNumber> {
    const { sourceChain, targetChain, asset, amount, receiver } = params;

    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    const assetConfig = this.getAssetConfig(sourceChain, targetChain, asset);

    if (!bridge || !assetConfig) {
      throw new Error('Bridge or asset configuration not found');
    }

    const signer = this.getSigner(sourceChain);
    const sender = await signer.getAddress();
    const bridgeContract = new ethers.Contract(
      bridge.bridgeContractAddress,
      BRIDGE_ABI,
      signer,
    );

    if (assetConfig.isNative) {
      return bridgeContract.estimateGas.receiveEthAt(receiver || sender, '0x', {
        value: amount,
      });
    }

    return bridgeContract.estimateGas.receiveTokensAt(
      assetConfig.bridgeTokenAddress || assetConfig.tokenContractAddress,
      amount,
      receiver || sender,
      '0x',
    );
  }

  // Get current gas price for a chain
  async getGasPrice(chain: ChainIds): Promise<string> {
    const provider = this.getProvider(chain);
    const gasPrice = await provider.getGasPrice();
    return gasPrice.toString();
  }
}
