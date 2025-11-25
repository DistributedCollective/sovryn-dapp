# @sovryn/sdk

## 2.0.9

### Patch Changes

- 0855c695: SOV-5247: BOS bridging and trading
- Updated dependencies [0855c695]
  - @sovryn/contracts@1.2.7

## 2.0.8

### Patch Changes

- 1974ce47: chore: USDT and WBTC on BOB migration
- ba60a4a8: feat(SOV-5169): new bob pools routes
- Updated dependencies [0b4f5048]
- Updated dependencies [1974ce47]
- Updated dependencies [e8cf255f]
  - @sovryn/utils@0.0.3
  - @sovryn/contracts@1.2.6

## 2.0.7

### Patch Changes

- 0f30438c: chore: do not refetch pool and token list from sdk
- fd201403: SOV-5105: Fix gas estimation error

## 2.0.6

### Patch Changes

- 8f1c3ff1: fix: asset symbol
- Updated dependencies [8f1c3ff1]
  - @sovryn/contracts@1.2.5

## 2.0.5

### Patch Changes

- 36b941bf: SOV-4539: fetch pools from indexer
- Updated dependencies [36b941bf]
  - @sovryn/sdex@0.3.15

## 2.0.4

### Patch Changes

- d3d711eb: SOV-4532: add PUPS pools
- Updated dependencies [d3d711eb]
  - @sovryn/contracts@1.2.4

## 2.0.3

### Patch Changes

- 52b7c4fe: chore: add new pools
- Updated dependencies [0bc23cc0]
- Updated dependencies [52b7c4fe]
  - @sovryn/contracts@1.2.3

## 2.0.2

### Patch Changes

- 750f7473: SOV-4496: add new pools
- Updated dependencies [750f7473]
  - @sovryn/contracts@1.2.2

## 2.0.1

### Patch Changes

- ef2f1abe: SOV-4457: rebrand SAT token
- Updated dependencies [ef2f1abe]
  - @sovryn/contracts@1.2.1

## 2.0.0

### Patch Changes

- Updated dependencies [f8c2f1e4]
- Updated dependencies [ee1cbe42]
  - @sovryn/contracts@1.2.0
  - @sovryn/ethers-provider@1.0.3

## 1.0.10

### Patch Changes

- 7625e9fc: chore: bring back WBTC/SAT pool

## 1.0.9

### Patch Changes

- 065c937d: SOV-4350: Disable SAT/WBTC pool and conversions via smart-router route

## 1.0.8

### Patch Changes

- ab40c983: feat: add SAT pools
- Updated dependencies [ab40c983]
  - @sovryn/contracts@1.1.8

## 1.0.7

### Patch Changes

- 6bdb10b2: fix: add minimum amount to zero smart swap route
- c7b7d38e: SOV-4286: allow WRBTC to be traded on smart router
- Updated dependencies [c7b7d38e]
- Updated dependencies [9ed0c28d]
  - @sovryn/contracts@1.1.7
  - @sovryn/sdex@0.3.13

## 1.0.6

### Patch Changes

- 746f3d6f: SOV-4239: add SDEX swap error logging for debugging
- Updated dependencies [746f3d6f]
  - @sovryn/sdex@0.3.12

## 1.0.5

### Patch Changes

- a53308e1: fix: smart router lookup

## 1.0.4

### Patch Changes

- a063f5b2: SOV-3922: move typedData / permits to smart router

## 1.0.3

### Patch Changes

- 312a7f0d: SOV-4075: POWA/RBTC Pool
- Updated dependencies [b702399f]
- Updated dependencies [312a7f0d]
  - @sovryn/contracts@1.1.2

## 1.0.2

### Patch Changes

- d9654336: fix: ambient smart router

## 1.0.1

### Patch Changes

- b566d2c1: fix: routers
- Updated dependencies [a9f57ae0]
- Updated dependencies [309ce36e]
  - @sovryn/sdex@0.3.11
  - @sovryn/contracts@1.1.1

## 1.0.0

### Minor Changes

- 0cfa22b0: Major refactoring for BOB chain launch
- 0cfa22b0: feat: allow multichain for smart router

### Patch Changes

- Updated dependencies [a65dbc6f]
- Updated dependencies [0cfa22b0]
- Updated dependencies [0cfa22b0]
- Updated dependencies [0cfa22b0]
  - @sovryn/contracts@1.1.0
  - @sovryn/utils@0.0.2

## 0.0.8

### Patch Changes

- 5ffe098c: SOV-3773: Update asset lists and smart-router swap routes

## 0.0.7

### Patch Changes

- f9006e45: SOV-3283: add fixed rate mynt converter
- Updated dependencies [f9006e45]
  - @sovryn/contracts@1.0.19

## 0.0.6

### Patch Changes

- f88ff42b: SOV-2921: improve zero redemption conversion route
- Updated dependencies [8d9a3fd4]
- Updated dependencies [8d9a3fd4]
- Updated dependencies [8d9a3fd4]
- Updated dependencies [8d9a3fd4]
  - @sovryn/contracts@1.0.14

## 0.0.5

### Patch Changes

- 73fbbb9e: SOV-2921: improve zero redemption conversion route

## 0.0.4

### Patch Changes

- f5317d5: fix: moc swap route should check available balance

## 0.0.3

### Patch Changes

- 253f8d3: SOV-2431: add moc integration swap route
- Updated dependencies [253f8d3]
- Updated dependencies [c1b42ea]
- Updated dependencies [5ad11c0]
  - @sovryn/contracts@1.0.9

## 0.0.2

### Patch Changes

- c59f619: SOV-2192: convert page v1 update
- c59f619: SOV-2595: Disable ETHs and BNBs in AMM swap route
- c59f619: SOV-2430: smart route for zero btc redemptions
- c59f619: fix: sort best routes using bigint and not a number
- c59f619: fix: add helpers to list supported assets
- Updated dependencies [c59f619]
- Updated dependencies [c59f619]
- Updated dependencies [e59acaa]
  - @sovryn/contracts@1.0.8

## 0.0.1

### Patch Changes

- e6221d8: fix: skip approval step if there is enough allowance
- 58a4bb8: SOV-2315: add smart router feature
- Updated dependencies [58a4bb8]
- Updated dependencies [79bfceb]
- Updated dependencies [58a4bb8]
- Updated dependencies [e42d5bd]
  - @sovryn/contracts@1.0.7
  - @sovryn/ethers-provider@1.0.1
