---
'@sovryn/sdk': patch
---

Canonicalize the Permit2 typed-data signature in the MocIntegration route before encoding it on-chain: wallets that return the ECDSA v byte as a raw recovery id (0/1 — Frame, onboard-ledger, some MPC wallets) or an EIP-2098 compact signature previously produced calldata that Permit2's ecrecover rejects. Signatures are normalized to the 65-byte r||s||v form with v in {27, 28}; canonical signatures pass through unchanged, malformed ones now throw at build time instead of reverting on-chain. SDK-side counterpart of the frontend fix in PR #1147.
