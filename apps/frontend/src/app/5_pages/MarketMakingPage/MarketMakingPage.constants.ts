import { ChainIds } from '@sovryn/ethers-provider';

import { COMMON_SYMBOLS } from '../../../utils/asset';
import { PromotionData } from './MarketMakingPage.types';
import { AmmLiquidityPool } from './utils/AmmLiquidityPool';

export const MAINNET_AMM = [
  new AmmLiquidityPool(
    COMMON_SYMBOLS.DLLR,
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0xe81373285eb8cdee2e0108e98c5aa022948da9d2',
    '0x3D5eDF3201876BF6935090C319FE3Ff36ED3D494',
  ),

  new AmmLiquidityPool(
    COMMON_SYMBOLS.SOV,
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0xe76Ea314b32fCf641C6c57f14110c5Baa1e45ff4',
    '0x09C5faF7723b13434ABdF1a65aB1B667BC02A902',
  ).setPreviousConverters([
    '0x3fd679b01ddab34da8f72b7ec301aa75ea25f338',
    '0x88a67a0e79e311fe93c6e2101d55d6d2ae3a7e94',
  ]),
  new AmmLiquidityPool(
    'FISH',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0xdeb0894196863dbb2f2d4c683f6d33a2197056b5',
    '0x35A74a38Fd7728F1c6BC39aE3b18C974b7979ddD',
  ).setPreviousConverters([
    '0xe731DA93034D769c2045B1ee137D42E1Aa23C18e',
    '0x832769cc15dbdd6814819988c7a875ec2cb943e8',
  ]),
  new AmmLiquidityPool(
    'MOC',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0xe321442DC4793c17F41Fe3fB192a856A4864cEAF',
    '0x7Fef930ebaA90B2f8619722adc55e3f1D965B79b',
  )
    .setSovRewards(false)
    .setPreviousConverters([
      '0x34031D1cd14e2C80B0268B47eFf49643375aFaeb',
      '0x60cc333072f16d5f4cb2bc36d6aa1f00381e22c2',
    ]),
  new AmmLiquidityPool(
    'RIF',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0x65528e06371635a338ca804cd65958a11cb11009',
    '0xAE66117C8105a65D914fB47d37a127E879244319',
  ).setPreviousConverters([
    '0x1769044CBa7aD37719badE16Cc71EC3f027b943D',
    '0xf6377dec9ce79b5bc0576618a5cd3e95f49f9ace',
  ]),
  new AmmLiquidityPool(
    'MYNT',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0x3a18e61d9c9f1546dea013478dd653c793098f17',
    '0x36263AC99ecDcf1aB20513D580B7d8D32D3C439d',
  ).setPreviousConverters(['0x25B8D024B39174824424f032423E03dd7dcCF044']),
  new AmmLiquidityPool(
    COMMON_SYMBOLS.XUSD,
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0xa9c3d9681215ef7623dc28ea6b75bf87fdf285d9',
    '0x6f96096687952349DD5944E0EB1Be327DcdeB705',
  ).setPreviousConverters([
    '0x029448377a56c15928ec783baf6ca736ed99a57f',
    '0x34163bb263ac77e9d6315676a2b9624cfc5ff861',
  ]),
  new AmmLiquidityPool(
    COMMON_SYMBOLS.RUSDT,
    COMMON_SYMBOLS.BTC,
    2,
    ChainIds.RSK_MAINNET,
    '0x448c2474b255576554EeD36c24430ccFac131cE3',
    '0x40580E31cc14DbF7a0859f38Ab36A84262df821D',
    '0x9c4017D1C04cFa0F97FDc9505e33a0D8ac84817F',
  ),
  new AmmLiquidityPool(
    'BNB',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0x1684b871ec5f93de142e79a670b541d75be07ead',
    '0x8f3d24ab3510294f1466aa105f78901b90d79d4d',
  ).setPreviousConverters([
    '0x3a36919f1d6729ea8bd2a04f72bd9d5396f7e549',
    '0x150bc1f9f1020255d44385865928aadc6b7ad9f3',
  ]),
  new AmmLiquidityPool(
    'ETH',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0xa57ec11497f45fe86eca50f4f1c9e75c8016a1af',
    '0xF41Ed702df2B84AcE02772C6a0D8AE46465aA5F4',
  ).setPreviousConverters([
    '0xcef26b429e272960d8fa2ea190b06df5dd8f68e2',
    '0xd8397c1944862b6a9674c85a5496c208dc9417bb',
  ]),
  new AmmLiquidityPool(
    'DOC',
    COMMON_SYMBOLS.BTC,
    2,
    ChainIds.RSK_MAINNET,
    '0xd715192612F03D20BaE53a5054aF530C9Bb0fA3f',
    '0x2dc80332C19FBCd5169ab4a579d87eE006Cb72c0',
    '0x840437BdE7346EC13B5451417Df50586F4dAF836',
  ),
  new AmmLiquidityPool(
    'BPRO',
    COMMON_SYMBOLS.BTC,
    2,
    ChainIds.RSK_MAINNET,
    '0x26463990196B74aD5644865E4d4567E4A411e065',
    '0x9CE25371426763025C04a9FCd581fbb9E4593475',
    '0x75e327A83aD2BFD53da12EB718fCCFC68Bc57535',
  ),
  new AmmLiquidityPool(
    'POWA',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0x4531DD0f24D204c08b251084E12ce3D3e70Dd03e',
    '0xBfd61419D30650FD943855b2bbE4C2A2E54857f9',
  ),
  new AmmLiquidityPool(
    'BOS',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_MAINNET,
    '0xF1DeE3175593f4e13a2b9e09a5FaafC513c9A27F',
    '0xfd834bbcde8c3ac4766bf5c1f5d861400103087b',
    undefined,
    true,
  ),
];

export const TESTNET_AMM = [
  new AmmLiquidityPool(
    COMMON_SYMBOLS.DLLR,
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0x5fc0b3ac4683bd8af8e244e646d897a2c3f2a6ac',
    '0x64B1aC8301f64c92721804ed78f2ee6025aaf7cE',
    // undefined,
    // true,
  ),
  new AmmLiquidityPool(
    COMMON_SYMBOLS.SOV,
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0xc2d05263318e2304fc7cdad40eea6a091b310080',
    '0xdF298421CB18740a7059b0Af532167fAA45e7A98',
  ).setPreviousConverters(['0xaBAABc2191A23D6Bb2cfa973892062c131cb7647']),
  new AmmLiquidityPool(
    'FISH',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0x4265d4f55219a4BDe9f1DE1348dA1f0b504849b4',
    '0xe41E262889f89b9a6331680606D9e9AabD01743e',
  ).setPreviousConverters(['0x5871040a14331c0f7AB5390A3Df16D271b0936ef']),
  new AmmLiquidityPool(
    'MOC',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0x2cb88F02cCA4dddBE8C41a6920853838Ada09F8b',
    '0x6e03DEFD0ae9091Be74f64c8CB9BE319994E5deB',
  )
    .setSovRewards(false)
    .setPreviousConverters(['0x3D18E1EC60c9725494252A835593aa90Da777E15']),
  new AmmLiquidityPool(
    'RIF',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0xA82881bceb367f8653559937A6eFBFffBF2E06DD',
    '0x67fAA17ce83b14B2EA0e643A9030B133edD3Cc43',
  ),
  new AmmLiquidityPool(
    'MYNT',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0x84953dAF0E7a9fFb8B4fDf7F948185e1cF85852e',
    '0xB12FA09a50c56e9a0C826b98e76DA7645017AB4D',
  ),
  new AmmLiquidityPool(
    COMMON_SYMBOLS.XUSD,
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0xD877fd00ECF08eD78BF549fbc74bac3001aBBb07',
    '0xb89D193c8a9Ae3fadF73B23519c215a0B7DD1B37',
  ).setPreviousConverters([
    '0x9a1aE300b23F4C676186e6d417ac586889aAfF42',
    '0xe5e750ead0e564e489b0776273e4a10f3f3d4028',
  ]),
  new AmmLiquidityPool(
    COMMON_SYMBOLS.RUSDT,
    COMMON_SYMBOLS.BTC,
    2,
    ChainIds.RSK_TESTNET,
    '0x133eBE9c8bA524C9B1B601E794dF527f390729bF',
    '0x7274305BB36d66F70cB8824621EC26d52ABe9069',
    '0xfFBBF93Ecd27C8b500Bd35D554802F7F349A1E9B',
  ),
  new AmmLiquidityPool(
    'BNB',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0x20d5c55c92615d416d73b34c8afed99288e99be1',
    '0xf97A3589c3fE2059fA3AB4819317B77b4BC6c9A8',
  ).setPreviousConverters(['0xA8D7FDd2f67273F178EFe731d4becd38E2A94E11']),
  new AmmLiquidityPool(
    'ETH',
    COMMON_SYMBOLS.BTC,
    1,
    ChainIds.RSK_TESTNET,
    '0x9f570ffe6c421e2c7611aaea14770b807e9fb424',
    '0xBb5B900EDa0F1459F582aB2436EA825a927f5bA2',
  ).setPreviousConverters(['0x4c493276E14791472633B55aaD82E49D28540bC6']),
  new AmmLiquidityPool(
    'DOC',
    COMMON_SYMBOLS.BTC,
    2,
    ChainIds.RSK_TESTNET,
    '0x497b0517dd24f66c456e93bc0adbb2a2bf159ec4',
    '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
    '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111',
  ),
  new AmmLiquidityPool(
    'BPRO',
    COMMON_SYMBOLS.BTC,
    2,
    ChainIds.RSK_TESTNET,
    '0xe4E467D8B5f61b5C83048d857210678eB86730A4',
    '0xdaf6FD8370f5245d98E829c766e008cd39E8F060',
    '0x98e5F39D8C675972A66ea165040Cb81803c440A3',
  ),
];

export const BLOCKS_PER_WEEK = 20160;

export const MINIMUM_REWARD = 500;

export const PLACEHOLDER_PROMOTION: PromotionData = {
  rewardAmount: 0,
  type: 'AMM',
  poolTokenA: '',
  asset1: COMMON_SYMBOLS.SOV,
  asset2: COMMON_SYMBOLS.BTC,
  ammData: {
    pool: '',
    data: {},
    balanceHistory: [],
  },
  linkAsset: '',
  apy: '',
};

export const AMM_SERVICE_URL = {
  [ChainIds.RSK_MAINNET]: 'https://amm-apy.sovryn.app/',
  [ChainIds.RSK_TESTNET]: 'https://amm-apy.test.sovryn.app/',
};

export const DEPOSIT_MIN_RETURN = '1';
