---
"@sovryn/sdk": patch
---

Support non-18-decimal tokens (USDT0) in the RSK AMM swap route: add USDT0 to the tradeable token list and normalize amounts between the router's 18-decimal convention and each token's native units in quote/swap/approve
