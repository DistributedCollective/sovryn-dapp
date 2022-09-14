# Sovryn Ethers provider

Helper to use and configure ethers JsonRPC provider.
Provider is for reading data from nodes and sending already signed transactions and not for signing it.
For signing transactions use `@sovryn/onboard-core`.

## Install

yarn add @sovryn/ethers-provider ethers

## Usage

Provider can be used in two ways

### 1. Get Provider using single chain config

```typescript
import { getProvider, Chain, ChainIds } from '@sovryn/ethers-provider';

const chain: Chain = {
  id: ChainIds.RSK_MAINNET,
  label: 'RSK Mainnet',
  rpcUrl: 'https://public-node.rsk.co',
} 

const balance = await getProvider(chain).getBalance('0x0000000...');
```

### 2. Get Provider using global config
```typescript
import init, { getProvider, Chain, ChainIds } from '@sovryn/ethers-provider';

const chains: Chain[] = [{
  id: ChainIds.RSK_MAINNET,
  label: 'RSK Mainnet',
  rpcUrl: 'https://public-node.rsk.co',
}, {
  id: ChainIds.RSK_TESTNET,
  label: 'RSK Testnet',
  rpcUrl: 'https://public-node.testnet.rsk.co',
}];

// call it once somewhere early in the dapp
const config = init(chains);

// Get balance of first initiliased chain (RSK_MAINNET on this example)
const balance1 = await getProvider().getBalance('0x0000000...');

// Get balance by chain id
const balance2 = await getProvider(ChainIds.RSK_TESTNET).getBalance('0x0000000...');

// Passing chain config object still works
const balance2 = await getProvider(chains[1]).getBalance('0x0000000...');

// Passing chain id of chain which wasnt registered with init will return null
getProvider(ChainIds.ROPSTEN) // returns null

// Register additional chains (note: it does not check for duplicates!)
config.addChains([
    id: ChainIds.RSK_ROPSTEN,
    label: 'Ropsten',
    rpcUrl: 'https://ropsten.infura....',
]);

// Update existing chain (note: it checks if ChainId already in the list, if so - updates it with new data, if ChainId is not set - new chain will be registered).
config.updateChain([
    id: ChainIds.RSK_ROPSTEN,
    label: 'Ethereum Ropsten',
    rpcUrl: 'https://ropsten.infura.io/v3/....',
]);

// Get list of registered chains
const supportedChains = config.chains();

// Subscribe to registered chain changes
const sub = config.observe.subscribe(items => console.log(items));
sub.unsubscribe();
```
