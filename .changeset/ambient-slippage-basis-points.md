---
'@sovryn/sdk': patch
---

Fix Ambient route slippage encoding: `options.slippage` is expressed in basis points (10_000 = 100%) but was divided by 1000 instead of 10000 before being passed to sdex, so the enforced slippage bound was 10x looser than the value the user selected (e.g. 0.5% became 5%). The fallback default now uses the shared `DEFAULT_SWAP_SLIPPAGE` constant (1%).
