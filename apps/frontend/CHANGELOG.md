# frontend

## 1.0.10

### Patch Changes

- 5ab3892: SOV-2083: add links to alpha
- af72d59: SOV-2042: wallet flashing on re-connect
- cd77951: SOV-2258: Fix Min collateral validation
- 8e5ca77: SOV-2216: New loader animations
- 7856201: SOV-2229: update token lists
- eafe33a: SOV-2184: update banner image on mobile
- ee52569: SOV-2150: fix animated balance
- Updated dependencies [8e5ca77]
- Updated dependencies [7856201]
  - @sovryn/ui@1.0.6
  - @sovryn/contracts@1.0.6

## 1.0.9

### Patch Changes

- 5fc86dd: SOV-2293: Add risk opt-in checkbox
- ddd93fd: SOV-2207: Fix undercollateralized error show on Earn page
- 345c9fe: SOV-2117: Add stability pool subsidies details to the Earn and Rewards pages
- Updated dependencies [5fc86dd]
- Updated dependencies [9fa9041]
- Updated dependencies [345c9fe]
  - @sovryn/ui@1.0.5
  - @sovryn/contracts@1.0.5

## 1.0.8

### Patch Changes

- 312b113: SOV-2065: Add redemptions alerts to D2 FE
- 31f7826: SOV-2281: fixes failing LOC transactions
  chore: implements transaction simulations using tenderly
- f87f24a: SOV-2280: Fix chart when LOC is closed
- 184f4a7: SOV-2131: fix max buttons
- 13ee989: SOV-2145: add Adjust - Borrow LOC maintenance states
- 43ee3dc: SOV-2219: infinite cRatio on adjust collateral
- 21f49cd: SOV-1986: fix asset balance refreshing
- Updated dependencies [f880454]
- Updated dependencies [18d7b0c]
  - @sovryn/contracts@1.0.4
  - @sovryn/ui@1.0.3

## 1.0.7

### Patch Changes

- 9a722d9: SOV-2060: Long decimal precision on Transaction Dialog amounts
- 5ea180a: SOV-1769: Make sure all transaction headers are left aligned
- 4b77135: SOV-2056: Convert page amount inputs not always resetting after tx
- 818e7d4: SOV-2025: loading screens
- 04604d1: SOV-1875: Disable Stability Pool withdrawals when Troves with ICR < MCR
- deaad83: SOV-1876: disable closing LoC when in Recovery mode
- 8829064: SOV-2064: maintenance mode optimizations
- 63aabb2: SOV-2061: D2 DLLR stats not staying in sync
- 9c71057: SOV-1814: Exception in console when disconnecting wallet on the Rewards page
- 70531d7: SOV-1906: Constants refactoring
- e54b8f3: SOV-2208: Rewards page layout is broken
- Updated dependencies [a89d4eb]
- Updated dependencies [818e7d4]
- Updated dependencies [c1963c8]
  - @sovryn/ui@1.0.2
  - @sovryn/tailwindcss-config@1.0.1

## 1.0.6

### Patch Changes

- 6336057: Bump gas limit for conversion
- 6da5e36: SOV-2057: fix typed data permit
- 47e9cc8: SOV-1758: Implement new notification signup user flow

## 1.0.5

### Patch Changes

- 5026e40: fix: Babelfish ZUSD balance stat

## 1.0.4

### Patch Changes

- 20e094b: SOV-1804: split FastBTC "send" and "receive" maintenance modes
- 37f110f: SOV-2012: Add correct hash to Fast BTC receive flow
- f724372: SOV-1943: new collateral ratio must be increased in recovery mode
- 735bd72: SOV-2089: Zero Fee Update - update Zero SDK package versions
- b90fcb9: SOV-1988: swap numbers with Decimal
- Updated dependencies [735bd72]
- Updated dependencies [b90fcb9]
- Updated dependencies [b90fcb9]
  - @sovryn/contracts@1.0.3
  - @sovryn/utils@0.0.1

## 1.0.3

### Patch Changes

- 71262bf: SOV-2053: Bump gas limit for conversions

## 1.0.2

### Patch Changes

- 5ce5f53: fix: incorrect balance retrieval method

## 1.0.1

### Patch Changes

- 680e77d: fix: mynt zusd balance stat

## 1.0.0

### Major Changes

- 9364d73: SOV-1841: D2 public mainnet release

### Patch Changes

- a69996d: fix: SOV-2049 ledger permit on for DLLR
- 1f52a56: Fix masset manager mainnet address
- Updated dependencies [1f52a56]
  - @sovryn/contracts@1.0.2

## 0.1.15

### Patch Changes

- f56c018: SOV-2045: Fix history frame signs
- 5c45c1b: SOV-1910: update banner

## 0.1.14

### Patch Changes

- 40abda0: SOV-1910: code cleanup
- e1a18c8: SOV-1910: use release SDK package version, fix typos & general cleanup
- 4609424: SOV-1807: Update how "max borrow amount" on Adjust modal is calculated
- e45538c: SOV-1763: Origination fee calculation/display in history table
- 81b8bf7: SOV-1820: fix toWei crashing when values in scientific notation passed
- 731634d: SOV-1581: LOC Dialog is using custom Secondary Tabs implementation
- 9489a88: SOV-1987 handle scientific numbers on AmountRenderer
- aed6538: SOV-1481: notification-tx-update
- 9ea732f: SOV-2011: add 404 page
- 018fd13: SOV-1762: update getting started dialog
- b38ec97: SOV-1985: added useTooltip prop in AmountRenderer comp
- 6742ea5: SOV-1915: fix error message for LOC
- 70a16a4: SOV-1996: Ensure tooltips display full value
- Updated dependencies [e1a18c8]
- Updated dependencies [018fd13]
  - @sovryn/contracts@1.0.1
  - @sovryn/ui@1.0.1

## 0.1.13

### Patch Changes

- 1c48461: SOV-1702: fix pending icon spin direction
- 24faa56: SOV-1377: Zero: Chart - implement redemption buffer display
- 6594de0: SOV-1355: bump sovryn-onboard package versions
- d30b00b: SOV-1701: Update footer logo
- f0273bc: SOV-1334: collateral surplus withdrawal history table
- 8c627ca: SOV-1920: fix infinite loop in LOCChart useEffect
- c6170e9: SOV-1664: Zero Dashboard Chart Fix
- 4c4fc0a: SOV-1578: single tx dllr
- d6f297a: SOV-1579: message and typed data signing
- 3e6ab79: SOV-1291: Convert page implementation
- f6a4c8c: SOV-1118: Zero: SP transactions history frame
- d0143b1: SOV-1622: Add staging environment detection
- ababf4b: SOV-1803: add page titles
- 52285ef: SOV-1408: Clear errors when switching tabs
- 6ee5f16: SOV-1498: Fix input width on transaction flow
- 174618e: SOV-1779: Refetch history data on every block
- dd88b96: SOV-1551: refresh dapp info when block changes
- aca21ba: SOV-1617: Close LoC modal after completion
- 76152ab: SOV-1681: Update rewards on every block
- e775c28: SOV-1488: Refactor error badge component
- 5aad864: SOV-1694: Fix min collateral error value in LoC
- c19dac0: SOV-969: Tiledesk integration
- 949563b: SOV-1847: fix crashing amount input
- c294ee4: SOV-1755: Hide funding button on testnet
- 3cfdfc4: SOV-1452: Define gas limits
- 413a9f5: SOV-1796: Align amount field with the guideline
- 763b0af: fix: reserve amount should be included for origination fee calculation
- 59b82e7: SOV-1911: LoC Chart fails to load when refreshing page with connected wallet
- b8a26bb: SOV-1788: convert amount loses decimal precision
- 12abdff: SOV-1407: reset WC flow state after connect
- f16301e: SOV-1360: Integrate new maintenance states
- 65025a5: SOV-1674: Unconfirmed email address warning
- 1f68f58: SOV-1492: Update Email Notification dialog copy
- bf3bf79: SOV-1136: Zero: Funding history frame
- b76872c: SOV-1486: Create AssetValue component
- 80f64de: SOV-1805: update LOC button position
- 3aa1d9e: SOV-1784: fix number format
- 11f966b: SOV-1499: update copy for transactions
- ac995c7: Sov 1096 notification stack component
- ac00fce: SOV-1712: Rewards 'Transfer to LOC' button fix
- 7533d8a: SOV-1446: Update Convert page copy
- 5e43122: SOV-1646: Add BTC TXID to Fast BTC send flow
- 89a60a2: SOV-1824: Use ErrorBadge component for all input errors
- 6310ea1: SOV-1923: Update Zero SDK package versions
- 8cbb2e3: SOV-1117: add stats component
- 20c1b69: SOV-1417: add notifications to email alert dialog
- 726d073: SOV-1451: fix: toWei crashing for values with large amount of decimals
- 2153669: SOV-1666: update data attributes
- a84a806: SOV-1884: fix notification dialog close bug
- 16ebc17: SOV-1650: restrict max rbtc amount allowed in max buttons
  SOV-1651: disable Done button when FastBTC tx in progress
  SOV-1652: fix Continue button on FastBTC send flow
  SOV-1655: prevent FastBTC dialog being preemptively closed
- c88ae8b: SOV-1484: Update styling
- 128c86c: SOV-1826: localise loading text
- b83300f: SOV-1418: amount input max validation cleanup
- 4c80d3f: SOV-1703: show build id
- 3d903ed: SOV-1481: Add Notification after transactions confirm/fail
- e289220: SOV-1333: reward history table
- 59ed27a: SOV-1818: Remove minimum borrow amount error
- 1016a32: SOV-1120: Redemptions history frame
- fdf6746: SOV-1603: Add Collateral surplus withdrawal table to History page
- 3a153e4: SOV-1464: default amount input is empty string instead of 0
- 1663f01: SOV-1803: fix terms of service url
- b636730: SOV-1661: Copy TX ID -> standard browser confirmation is shown
- 202e52f: SOV-998: Zero Dashboard LoC Integration
- 3abac74: Feat/sov 1289 zero simplified rewards page
- d553c9c: SOV-1626: Replace useTranslation() hook usage with direct "t" import
- 45832f3: SOV-1780: reset amount inputs on Convert page after tx
- 8c6ae41: SOV-1797: Adjust borrow layout so all content visible
- bc21b46: SOV-1802: Fix liquidation price in open LOC
- d22fca6: SOV-1277: track current block number
- 0df76c5: Feat/sov 1115 zero dashboard loc chart
- b881d3f: SOV-1660: loc chart crashing app when user has no trove
- a365510: SOV-1515: opening and repaying trove using DLLR
- dc2fa10: SOV-1768: toWei method for really small numbers
- 5dc5bda: SOV-1845: Fix how origination fee is calculated
- 01de1a2: SOV-1266: FastBTC bridge flow implementation
- 1e1942e: SOV-1787: Fix tx text typos
- a93ea95: SOV-1561: autoconnect to previous wallet
- 92cafa0: SOV-913: service worker + dapp update dialog
- 5ea9255: SOV-1521: max collateral amounts with deducted fees
- d4bd3c7: SOV-1701: Update footer links
- 32e4cb9: SOV-1611: "TX ID" should be called "TXID"
- 7ab6b72: SOV-1913: add description meta tags
- 3bdec6e: SOV-1597: Zero LoC chart only showing 8 LoCs
  SOV-1604: Wallet Address not showing in chart tooltip
- c6d90ff: SOV-1590: Remove hardcoded value in statistics
- 2ac2ab8: SOV-1949: show label for Transfer Gains tx type on Transaction History table
- 7207cc3: SOV-1471: add data attributes to Convert page and Connect Wallet button
- d02e9a7: Sov 1287 zero stability pool page implementation
- 51a4ab6: SOV-1121: History page implementation
- fcea7e9: SOV-1586: trigger funding flow from anywhere within dapp
- 577e88e: SOV-1610: Use BTC instead RBTC everywhere
- 726c396: feat: add zero loans
- 8ee299a: SOV-1767: dynamic collateral amount
- 0fb23e2: SOV-1673: Fix "close line of credit" modal
  SOV-1678: LOC -> Close -> DLLR option disappears from the drop down of tokens
- 4171c93: SOV-1792: Fix collateral surplus history table
- 6c3ec0c: SOV-1458: updated LOC Chart
- 5a9078e: SOV-1310: Zero welcome dashboard banner implementation
- 9a3adbe: SOV-1648: User's LOC is not highlighted in the chart
- c318e48: SOV-1629: Stats panels should be full width on mobile
- 072ff76: SOV-1440: Integrate Getting Started popup
- 475f911: chore: added email landing pages
- 3a7d41f: SOV-1506: Update Footer links
- efaa18c: SOV-1636: update readme, browser compatibility
- 1634d14: SOV-1502: Localisation file cleanup
- af2b3e9: SOV-1614: Update default gas limits
- 7f7dfd7: SOV-1870: update dapp metadata
- a50624d: SOV-1815: Fix app crashing after disconnecting a wallet on Fast BTC
- db49613: SOV-1473: Add asset icon to dropdowns
- 30fb4fc: SOV-1472: add missing data attributes
- 3c9cf1b: SOV-1122: Conversions history frame
- Updated dependencies [1c48461]
- Updated dependencies [5ea9255]
- Updated dependencies [1e0a47f]
- Updated dependencies [0695fe9]
- Updated dependencies [18d45bc]
- Updated dependencies [3e6ab79]
- Updated dependencies [409d5a1]
- Updated dependencies [2f2480a]
- Updated dependencies [e775c28]
- Updated dependencies [726c396]
- Updated dependencies [f16301e]
- Updated dependencies [2b94683]
- Updated dependencies [31c03a1]
- Updated dependencies [11f966b]
- Updated dependencies [ac995c7]
- Updated dependencies [7533d8a]
- Updated dependencies [89a60a2]
- Updated dependencies [99e26b4]
- Updated dependencies [2295c60]
- Updated dependencies [2153669]
- Updated dependencies [c096ac8]
- Updated dependencies [3a153e4]
- Updated dependencies [b636730]
- Updated dependencies [3abac74]
- Updated dependencies [541e7ff]
- Updated dependencies [01de1a2]
- Updated dependencies [d02e9a7]
- Updated dependencies [51a4ab6]
- Updated dependencies [577e88e]
- Updated dependencies [475f911]
- Updated dependencies [762eeae]
- Updated dependencies [c51421d]
- Updated dependencies [db49613]
  - @sovryn/tailwindcss-config@1.0.0
  - @sovryn/ui@1.0.0
  - @sovryn/contracts@1.0.0
  - @sovryn/ethers-provider@1.0.0

## 0.1.12

### Patch Changes

- 3969a12: SOV-1406: fix: pagination in WalletConnect modal
- 9ee7347: SOV-1191: Email notification dialog integration
- Updated dependencies [db0d93c]
- Updated dependencies [9ee7347]
- Updated dependencies [c10e41c]
  - @sovryn/ui@0.0.17

## 0.1.11

### Patch Changes

- 748bcd8: SOV-1364: Use dataAttribute instead of dataLayoutId in props
- 7bf1be6: add close LOC popup
- 7899d32: SOV-1181: feat: add D2 maintenance states
- 654ad44: SOV-1116: feat: add LOCStatus component
- 61e02ca: SOV-1243: update onboard-react package version
- Updated dependencies [748bcd8]
- Updated dependencies [79fa9e3]
  - @sovryn/ui@0.0.16

## 0.1.10

### Patch Changes

- 8a26b54: Sov 1091 csv export implementation
- 2e208ec: SOV-1010: zero collateral ratio healthbar component
- 264874c: SOV-106: Graph configuration
- 027814b: SOV-1101: utility hook to retrieve asset balance
- 240dd5a: SOV-1024: Add Test Zero Contract call
- 79378c9: feat: Privacy Policy & Terms of Use
- b883727: SOV-814: Maintenance mode setup
- 63be5ae: SOV-914: Page Container
- 5857a84: Add WalletBalance component
- 1fa8e30: [Notification] - add component
- 94a5869: Feat/sov 1018 zero loc transaction history frame
- 8bc8e1a: SOV-1090: Zero - LOC getting started popup
- 2543b10: SOV-994: Email notification settings dialog
- Updated dependencies [df8a16f]
- Updated dependencies [8a26b54]
- Updated dependencies [718c6a7]
- Updated dependencies [7ea9995]
- Updated dependencies [2e208ec]
- Updated dependencies [027814b]
- Updated dependencies [9f13eb2]
- Updated dependencies [5857a84]
- Updated dependencies [1fa8e30]
- Updated dependencies [8547bb8]
- Updated dependencies [43137ba]
  - @sovryn/ui@0.0.14
  - @sovryn/contracts@0.0.3

## 0.1.9

### Patch Changes

- b3cc7d0: SOV-1010: zero collateral ratio healthbar component
- b3cc7d0: SOV-106: Graph configuration
- b3cc7d0: SOV-914: Page Container
- b3cc7d0: [Notification] - add component
- Updated dependencies [b3cc7d0]
- Updated dependencies [b3cc7d0]
- Updated dependencies [b3cc7d0]
- Updated dependencies [b3cc7d0]
  - @sovryn/ui@0.0.13

## 0.1.8

### Patch Changes

- dd61879: SOV-1086: feat: helper functions for working with ethers bignumbers
- Updated dependencies [b87945b]
  - @sovryn/ui@0.0.12

## 0.1.7

### Patch Changes

- 7c12339: SOV-1087: add getTokenInfoByAddress, use in tx flow
- 92f76c8: [Footer] - add a footer to the dapp2
- 9ceba15: SOV-823: add transaction approval dialog
- d0ee401: SOV-1010: zero collateral ratio healthbar component
- 008dd28: SOV-106: Graph configuration
- aa14f3f: SOV-1024: Add Test Zero Contract call
- 76f263c: SOV-914: Page Container
- f3ce804: Add WalletBalance component
- 79a4bd3: [Notification] - add component
- bb93084: [LanguageSelector] - add component
- 993adcc: SOV-1071: Add token details list to contracts package
- Updated dependencies [7c12339]
- Updated dependencies [92f76c8]
- Updated dependencies [9ceba15]
- Updated dependencies [8178479]
- Updated dependencies [976d6f3]
- Updated dependencies [d0ee401]
- Updated dependencies [477760b]
- Updated dependencies [f3ce804]
- Updated dependencies [79a4bd3]
- Updated dependencies [993adcc]
- Updated dependencies [6e8ad26]
  - @sovryn/contracts@0.0.2
  - @sovryn/ui@0.0.11

## 0.1.6

### Patch Changes

- 9dbd23a: feat: dapp header added
- 9ee9581: SOV-1016: change how chains are defined and used
- Updated dependencies [9dbd23a]
- Updated dependencies [bfc048a]
- Updated dependencies [9ee9581]
- Updated dependencies [9ee9581]
- Updated dependencies [630653f]
- Updated dependencies [ef15b51]
  - @sovryn/ui@0.0.10
  - @sovryn/ethers-provider@0.0.2
  - @sovryn/contracts@0.0.1

## 0.1.5

### Patch Changes

- fd6cfc2: SOV-817: blockchain rpc fallback
- Updated dependencies [fd6cfc2]
- Updated dependencies [ae7b3f8]
  - @sovryn/ethers-provider@0.0.1
  - @sovryn/ui@0.0.9

## 0.1.4

### Patch Changes

- 6a9f57d: SOV-826: Add SovrynLogo component
- 9d45ade: SOV-813: add helper functions to find contracts
- Updated dependencies [c106055]
  - @sovryn/ui@0.0.8

## 0.1.3

### Patch Changes

- 548f6a1: feat: dapp header added
- 4b5c737: SOV-807: Environment switching
- 51b7c57: SOV-828: SocialLinks and LinkBase components
- Updated dependencies [548f6a1]
- Updated dependencies [801e2b8]
- Updated dependencies [07712d9]
- Updated dependencies [2f26923]
- Updated dependencies [51b7c57]
- Updated dependencies [801e2b8]
- Updated dependencies [49455af]
  - @sovryn/ui@0.0.7

## 0.1.2

### Patch Changes

- 5321c95: Sov 808 d 2 transaction step component
- Updated dependencies [5321c95]
- Updated dependencies [e4df0aa]
  - @sovryn/ui@0.0.6

## 0.1.1

### Patch Changes

- 68346b6: SOV-787 - Add react-i18n package support
- 319d944: Feat/sov 789 d 2 header component
- f744382: SOV-153: enable walletConennect module
- Updated dependencies [ccf4a26]
- Updated dependencies [04869b5]
- Updated dependencies [4fd7e46]
- Updated dependencies [319d944]
- Updated dependencies [4be658a]
- Updated dependencies [faa8341]
- Updated dependencies [68b5b4d]
- Updated dependencies [f744382]
- Updated dependencies [b789f54]
- Updated dependencies [03d959e]
- Updated dependencies [96ffcf0]
- Updated dependencies [6820d8f]
- Updated dependencies [731ef10]
  - @sovryn/ui@0.0.5
  - @sovryn/tailwindcss-config@0.0.2
