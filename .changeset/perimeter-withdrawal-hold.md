---
'frontend': minor
---

feat: Sovryn Perimeter withdrawal hold. Shows how long a withdrawal will be held before it is paid out, on lending withdrawals, borrower exits and Zero collateral withdrawal/close, and adds a Perimeter vault page at /perimeter listing the withdrawals currently held for the connected account with the state each is in and a Release action for the ones that are ready. Also corrects the on-chain surface ids after the contracts renamed them, without which the existing fee display would silently stop matching any configured policy. Gated purely on on-chain state and fail-hidden: while the perimeter is undeployed, unwired or disabled every form renders exactly as it does today and the vault page reads as empty.
