# Perimeter queue discovery after rollback

The withdraw queue page follows the lending and Zero consumer queue pointers and
remembers discovered queues for the current tab. A fresh tab after those getters
are retired also needs a deployment queue recorded in the frontend build.

These optional public build inputs are selected only for the configured Rootstock
read network. They are compiled into the bundle and must contain no secrets.

| Network            | Queue address                           | Expected code hash                                   |
| ------------------ | --------------------------------------- | ---------------------------------------------------- |
| Mainnet (chain 30) | `REACT_APP_PERIMETER_QUEUE_RSK_MAINNET` | `REACT_APP_PERIMETER_QUEUE_RSK_MAINNET_RUNTIME_HASH` |
| Testnet (chain 31) | `REACT_APP_PERIMETER_QUEUE_RSK_TESTNET` | `REACT_APP_PERIMETER_QUEUE_RSK_TESTNET_RUNTIME_HASH` |

Leave both inputs unset when no Perimeter queue has been deployed. An unset pair
preserves the existing Phase 1 absence behavior. A nonzero address requires a
32-byte `0x`-prefixed hash. Mainnet inputs are never reused for testnet or another
chain. Invalid or incomplete inputs, a provider network mismatch, empty or
mismatched code, and failed validation reads produce the existing unreadable
warning; the unverified fallback address is not queried for withdrawals.

The hash is **Keccak-256 of the complete runtime bytes returned by `eth_getCode`
at the queue address**, including metadata. For an ERC1967Proxy deployment this
is the **proxy runtime code hash**, not the implementation hash. Matching that
hash does not establish the proxy's implementation, storage slots, initialization,
authority or full implementation runtime. Those require independent deployment
and release verification before these public build inputs are supplied.

Validated fallback queues are unioned with consumer-derived and remembered
queues. Duplicate queue addresses and request IDs are removed. Consumer read
failures remain visible even when fallback withdrawals can be listed. Validation
uses the existing 30-second cache and bounded reads. Each validation asks every
available JSON-RPC backend for `eth_chainId`; cached static-provider network
metadata is insufficient. A mismatching or unreadable backend rejects the
fallback validation. Keep the standalone queue
inputs in subsequent builds while it has outstanding requests after rollback.

Use the actual deployment address and independently verified expected code hash;
unit-test addresses and dummy bytecode are not deployment inputs. Changes to
these values require a new frontend build. This fallback restores discovery;
release eligibility, signing checks and on-chain payment rules remain separate.
