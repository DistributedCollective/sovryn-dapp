---
'frontend': patch
---

Perimeter vault fixes: exclude a just-released hold from the batch release so it cannot revert the whole atomic transaction; stop showing the withdrawal-hold notice on a borrow or add-collateral adjust that removes nothing; correct the "Releasable by the owner" status label and use the full "Sovryn Perimeter vault" name in the hold notification.
