# Sovryn SDK

## Installation

```bash
yarn add @sovryn/sdk @sovryn/contracts @sovryn/ethers-provider ethers @ethersproject/providers @ethersproject/abstract-provider
```

## Smart Router

Smart router is a wrapper around the smart contracts that allows you to interact with the smart contracts for swapping tokens in a more convenient way.

### Usage

```typescript
import { SmartRouter, DEFAULT_SWAP_ROUTES } from '@sovryn/sdk';
import { getProvider } from '@sovryn/ethers-provider';

// Get ethers provider
const provider = getProvider();

// Create a new instance of the smart router, passing the provider and the swap routes to use
const smartRouter = new SmartRouter(provider, DEFAULT_SWAP_ROUTES);

// Get token addresses we want to swap
const xusdToken = '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F';
const sovToken = '0xEFc78fc7d48b64958315949279Ba181c2114ABBd';
const amount = 100;

// Get the best swap route for a token pair
// result contains the best route and the amount of tokens we will get
// { route: SwapRoute, quote: BigNumber }
const result = await smartRouter.getBestQuote(ChainIds.RSK_MAINNET, xusdToken, sovToken, amount);

// Check if we need to permit xusd token to be able to swap
// permitTxData will return the permit data to be signed by the user
const permitTxData = await result.route.permit(xusdToken, sovToken, amount)
let signedPermit: string | undefined;
if (permitTxData) {
  // ask user to sign the transaction with permitTxData as data
  signedPermit = await signPermit(permitTxData);
}

// If permit is possible and approval is not required, we can skip the approval step
if (!permitTxData || permitTxData?.approvalRequired) {
  // Check if we need to approve xusd token to be able to swap
  // approveTxData will return the transaction data to be signed by the user
  // In most cases it will only have `to` and `data` fields
  const approveTxData = await result.route.approve(xusdToken, sovToken, amount)
  if (approveTxData) {
    // ask user to sign the transaction with approveTxData as data
  }
}

// Swap tokens
const txData = await result.route.swap(xusdToken, sovToken, amount, {
  // pass the permit data if permit is required
  typedDataValue: permitTxData?.typedData?.values,
  // pass signature if permit is required
  typedDataSignature: signedPermit,
});

// Sign the transaction with the user wallet of your choosing and send it to the network
const tx = await signAndSend(txData);
```
