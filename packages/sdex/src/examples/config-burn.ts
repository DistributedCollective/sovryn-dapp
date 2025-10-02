/* eslint-disable @typescript-eslint/no-unused-vars */
//import { BigNumber } from 'ethers';

/* eslint-disable @typescript-eslint/no-unused-vars */
//import { priceToTick } from '../utils/price';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import { tickToPrice } from '../utils/price';

export const bobMainnetAmbientPoolConfigs = [
  {
    baseToken: {
      tokenSymbol: 'DAI',
      tokenAddress: '0x6c851f501a3f24e29a8e39a29591cddf09369080',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    poolIdx: 410,
    lpTokenAmount: '4172.085146727704',
    lpConduit: '0xEb92Ae0ce520D099b0FB51Ef297f581c5AB57dbf',
  },
  {
    baseToken: {
      tokenSymbol: 'rETH',
      tokenAddress: '0xb5686c4f60904ec2bda6277d6fe1f7caa8d1b41a',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    poolIdx: 410,
    lpTokenAmount: '125.60972122809605',
    lpConduit: '0xE668D03C31f78713952953cE6f345b1D0137B754',
  },
  {
    baseToken: {
      tokenSymbol: 'SOV',
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    quoteToken: {
      tokenSymbol: 'POWA',
      tokenAddress: '0xd0C2f08a873186db5cFB7b767dB62BEF9e495BFF',
    },
    poolIdx: 420,
    lpTokenAmount: '23575465.615384575',
    lpConduit: '0xbFB1bF6dCc02baCeB8C4c336457798c9b4ED1225',
  },
  {
    baseToken: {
      tokenSymbol: 'wstETH',
      tokenAddress: '0x85008aE6198BC91aC0735CB5497CF125ddAAc528',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },

    poolIdx: 410,
    lpTokenAmount: '279.10777089558167',
    lpConduit: '0xBd696d1a6E09D051dDce2d7DcDDD6B6Bf082f8AA',
  },
];
// console.log('[priceToTick(0.01), priceToTick(100)]:', [
//   priceToTick(0.0009),
//   priceToTick(0.0008),
// ]);
// console.log('[priceToTick(14465186888527), priceToTick(14465186888527)]:', [
//   priceToTick(14465186888527),
//   priceToTick(17491213330499),
// ]);
// console.log('tickToPrice(14465186888527), tickToPrice(14465186888527)]:', [
//   tickToPrice(14465186888527),
//   tickToPrice(17491213330499),
// ]);
// console.log('[tickToPrice(-2764240), tickToPrice(-276196)]:', [
//   tickToPrice(-2764240),
//   tickToPrice(-276196),
// ]);
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
//const stablesRangeMultipliers = [0.99044, 1.01288]; // [0.1, 10000]; - to play around with the price range - hasn't worked though
export const bobMainnetConcentratedPoolConfigs = [
  //{
  //   baseToken: {
  //     tokenSymbol: 'DLLR',
  //     tokenDeploymentName: 'DLLR',
  //     isNativeToken: false,
  //     tokenAddress: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
  //   },
  //   quoteToken: {
  //     tokenSymbol: 'SOV',
  //     tokenDeploymentName: 'SOV',
  //     isNativeToken: false,
  //     tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
  //   },
  //   price: 0.56,
  //   poolIdx: 400,
  //   amountSqrtXY: 0,
  //   rangeMultipliers: [0.2, 5], // [-80%, + 5X]
  //   tickRange: [-21896, 10296],
  // },
  // {
  //   baseToken: {
  //     tokenSymbol: 'USDT',
  //     tokenDeploymentName: 'USDT',
  //     isNativeToken: false,
  //     tokenAddress: '0x05d032ac25d322df992303dca074ee7392c117b9',
  //   },
  //   quoteToken: {
  //     tokenSymbol: 'DLLR',
  //     tokenDeploymentName: 'DLLR',
  //     isNativeToken: false,
  //     tokenAddress: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
  //   },
  //   price: 0.00009219475707, //1,
  //   poolIdx: 400,
  //   amountSqrtXY: BigNumber.from(0), // 0 - will be queried from the tickRange //BigNumber.from('10028165608911452160') SqrtXY amount - from SdexQuery queryRangePosition func https://explorer.gobob.xyz/address/0x1dff4Ff93dF17Ad6F44E23368341CcFb8fB8B675?tab=read_write_contract
  //   rangeMultipliers: stablesRangeMultipliers,
  //   tickRange: [-276424, -276196], //[(priceToTick(0.9), priceToTick(1.01))], //[303042, 304942], //[-276424, -276196], - previous, didn't work
  // },
  {
    baseToken: {
      tokenSymbol: 'USDC',
      tokenDeploymentName: 'USDC',
      isNativeToken: false,
      tokenAddress: '0xe75D0fB2C24A55cA1e3F96781a2bCC7bdba058F0',
    },
    quoteToken: {
      tokenSymbol: 'USDT',
      tokenDeploymentName: 'USDT',
      isNativeToken: false,
      tokenAddress: '0x05d032ac25d322df992303dca074ee7392c117b9',
    },
    price: 1,
    poolIdx: 400,
    amountSqrtXY: 0,
    rangeMultipliers: [0.995, 1.005], //make it symmetric
    tickRange: [-52, 52],
  },
  // {
  //   baseToken: {
  //     tokenSymbol: 'WBTC',
  //     tokenDeploymentName: 'WBTC',
  //     isNativeToken: false,
  //     tokenAddress: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
  //   },
  //   quoteToken: {
  //     tokenSymbol: 'TBTC',
  //     tokenDeploymentName: 'tBTC',
  //     isNativeToken: false,
  //     tokenAddress: '0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2',
  //   },
  //   price: 1,
  //   poolIdx: 400,
  //   amountSqrtXY: 0,
  //   rangeMultipliers: [0.995, 1.005], //make it symmetric
  //   tickRange: [-230324, -230220],
  //  },
];
