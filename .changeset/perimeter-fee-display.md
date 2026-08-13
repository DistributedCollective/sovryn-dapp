---
'frontend': minor
---

feat: Sovryn Perimeter Fee display on withdraw and close flows. Shows the fee rate, amount, and net "You will receive" on lending withdrawals, borrower exits, Zero collateral withdrawal/close, and the surplus claim. Gated purely on on-chain state and fail-hidden: nothing renders until governance activates the perimeter and charging is enabled, so current forms are unchanged until then.
