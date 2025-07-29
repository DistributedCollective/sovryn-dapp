import { ethers, Signer } from 'ethers';

import { getAsset, getAssetData } from '@sovryn/contracts';
import { ChainIds, ChainId } from '@sovryn/ethers-provider';
import { ERC20_ABI } from '@sovryn/sdex';

import ALLOW_TOKENS_ABI from './abis/allowTokens.json';
import BRIDGE_ABI from './abis/bridge.json';
import {
  getBridge,
  getSupportedBridgesBySource,
  getSupportedBridgesByTarget,
} from './config/bridges';
import { getBridgeNetwork } from './config/networks';
import {
  BridgeDepositParams,
  BridgeLimits,
  AssetConfig,
  NetworkConfig,
  BridgeConfig,
} from './types';

export class BridgeService {
  private getProvider(chain: ChainId): ethers.providers.JsonRpcProvider {
    const rpcUrl = getBridgeNetwork(chain)?.rpcUrl;
    if (!rpcUrl) {
      throw new Error(`RPC url not found`);
    }
    return new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  // Get bridge configuration
  getBridgeConfig(
    sourceChain: ChainId,
    targetChain: ChainId,
  ): BridgeConfig | undefined {
    return getBridge(sourceChain, targetChain);
  }

  // Get network configuration
  getNetworkConfig(chain: ChainId): NetworkConfig | undefined {
    return getBridgeNetwork(chain);
  }

  // Get asset configuration
  getAssetConfig(
    sourceChain: ChainId,
    targetChain: ChainId,
    symbol: string,
  ): AssetConfig | undefined {
    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    return bridge?.assets.find(a => a.symbol === symbol);
  }

  // Get assets by source chain
  getAssetsBySourceChain(sourceChain: ChainId): AssetConfig[] {
    const supportedBridges = getSupportedBridgesBySource(sourceChain);
    const assets: AssetConfig[] = [];

    for (const bridge of supportedBridges) {
      assets.push(
        ...bridge.assets.map(asset => ({
          ...asset,
          mainChainId: bridge.mainChainId,
          sideChainId: bridge.sideChainId,
        })),
      );
    }

    return assets;
  }

  // Get assets by target chain
  getAssetsByTargetChain(targetChain: ChainId): AssetConfig[] {
    const supportedBridges = getSupportedBridgesByTarget(targetChain);
    const assets: AssetConfig[] = [];

    for (const bridge of supportedBridges) {
      assets.push(
        ...bridge.assets.map(asset => ({
          ...asset,
          mainChainId: bridge.mainChainId,
          sideChainId: bridge.sideChainId,
        })),
      );
    }

    return assets;
  }

  // Get aggregator balance
  async getBridgeAggregatorBalance(
    sourceChain: ChainId,
    targetChain: ChainId,
    asset: string,
  ) {
    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    const assetConfig = this.getAssetConfig(sourceChain, targetChain, asset);
    const assetDetails = await getAsset(asset, sourceChain);

    if (!bridge || !assetConfig || !assetConfig.aggregatorContractAddress) {
      return;
    }

    const provider = this.getProvider(sourceChain);
    const token = new ethers.Contract(
      (assetConfig.bridgeTokenAddress || assetDetails.address).toLowerCase(),
      ERC20_ABI,
      provider,
    );
    return (
      await token.balanceOf(assetConfig.aggregatorContractAddress.toLowerCase())
    ).toString();
  }

  // Get bridge limits
  async getBridgeLimits(
    sourceChain: ChainId,
    targetChain: ChainId,
    asset: string,
  ): Promise<BridgeLimits> {
    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    const assetConfig = this.getAssetConfig(sourceChain, targetChain, asset);

    if (!bridge || !assetConfig) {
      throw new Error('Bridge or asset configuration not found');
    }

    const provider = this.getProvider(sourceChain);

    const bridgeContract = new ethers.Contract(
      bridge.bridgeContractAddress.toLowerCase(),
      BRIDGE_ABI,
      provider,
    );
    const allowTokensContract = new ethers.Contract(
      bridge.allowTokensContractAddress.toLowerCase(),
      ALLOW_TOKENS_ABI,
      provider,
    );

    const [spentToday, dailyLimit, minPerToken, feePerToken, maxTokensAllowed] =
      await Promise.all([
        bridgeContract.spentToday(),
        allowTokensContract.dailyLimit(),
        allowTokensContract.getMinPerToken(
          assetConfig.bridgeTokenAddress?.toLowerCase(),
        ),
        allowTokensContract.getFeePerToken(
          assetConfig.bridgeTokenAddress?.toLowerCase(),
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
    chain: ChainId,
    asset: string,
    spender: string,
    amount: string,
    signer: Signer,
  ): Promise<ethers.ContractTransaction> {
    const assetDetails = await getAssetData(asset, chain);

    if (!assetDetails || assetDetails.isNative) {
      throw new Error('Cannot approve native asset');
    }

    const token = assetDetails.contract(signer);

    // Special handling for USDT on Ethereum
    if (
      [ChainIds.MAINNET, ChainIds.ROPSTEN].includes(chain as ChainIds) &&
      asset === 'USDT'
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
    const { sourceChain, targetChain, asset, amount, receiver, signer } =
      params;

    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    const assetConfig = this.getAssetConfig(sourceChain, targetChain, asset);
    const assetData = await getAsset(asset, sourceChain);

    if (!bridge || !assetConfig) {
      throw new Error('Bridge or asset configuration not found');
    }

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
      assetConfig.bridgeTokenAddress || assetData.address,
      amount,
      receiver || sender,
      '0x',
    );
  }

  // Get allowance
  async getAllowance(
    chain: ChainId,
    asset: string,
    owner: string,
    spender: string,
  ): Promise<string> {
    const assetData = await getAsset(chain, asset);

    if (!assetData || assetData.isNative) {
      return ethers.constants.MaxUint256.toString();
    }

    const provider = this.getProvider(chain);
    const token = new ethers.Contract(assetData.address, ERC20_ABI, provider);

    return (await token.allowance(owner, spender)).toString();
  }

  // Get token balance
  async getBalance(
    chain: ChainId,
    asset: string,
    address: string,
  ): Promise<string> {
    const provider = this.getProvider(chain);
    const assetData = await getAsset(chain, asset);

    if (!assetData) {
      throw new Error(`Asset ${asset} not found for chain ${chain}`);
    }

    if (assetData.isNative) {
      return (await provider.getBalance(address)).toString();
    }

    const token = new ethers.Contract(assetData.address, ERC20_ABI, provider);

    return (await token.balanceOf(address.toLowerCase())).toString();
  }

  // Get transaction status
  async getTransactionStatus(
    chain: ChainId,
    txHash: string,
  ): Promise<ethers.providers.TransactionReceipt> {
    const provider = this.getProvider(chain);
    return provider.getTransactionReceipt(txHash);
  }

  async getTransactionHistory(
    chain: ChainId,
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

  // Estimate gas for depositx
  async estimateDepositGas(
    params: BridgeDepositParams,
  ): Promise<ethers.BigNumber> {
    const { sourceChain, targetChain, asset, amount, receiver, signer } =
      params;

    const bridge = this.getBridgeConfig(sourceChain, targetChain);
    const assetConfig = this.getAssetConfig(sourceChain, targetChain, asset);
    const assetData = await getAsset(sourceChain, asset);

    if (!bridge || !assetConfig) {
      throw new Error('Bridge or asset configuration not found');
    }

    const sender = await signer.getAddress();
    const bridgeContract = new ethers.Contract(
      bridge.bridgeContractAddress.toLowerCase(),
      BRIDGE_ABI,
      signer,
    );

    if (assetConfig.isNative) {
      return bridgeContract.estimateGas.receiveEthAt(receiver || sender, '0x', {
        value: amount,
      });
    }

    return bridgeContract.estimateGas.receiveTokensAt(
      assetConfig.bridgeTokenAddress || assetData.address,
      amount,
      receiver || sender,
      '0x',
    );
  }

  // Get current gas price for a chain
  async getGasPrice(chain: ChainId): Promise<string> {
    const provider = this.getProvider(chain);
    const gasPrice = await provider.getGasPrice();
    return gasPrice.toString();
  }
}
