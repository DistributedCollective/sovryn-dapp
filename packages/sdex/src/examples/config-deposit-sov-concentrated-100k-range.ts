export const bobMainnetConcentratedPoolConfigs = [
  {
    baseToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    quoteToken: {
      tokenSymbol: 'USDT',
      tokenDeploymentName: 'USDT',
      isNativeToken: false,
      tokenAddress: '0x05d032ac25d322df992303dca074ee7392c117b9',
    },
    price: 1.0, //1.4, //0.72,
    poolIdx: 410,
    amountInBase: 10, //8847165.444668792, //12287729.784262212 DLLR @ 1.38 DLLR/SOV //8847165.444668792 SOV @ 0.72 DLLR/SOV
    rangeMultipliers: [500000, 500001],
  },
  {
    baseToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    quoteToken: {
      tokenSymbol: 'DLLR',
      tokenDeploymentName: 'DLLR',
      isNativeToken: false,
      tokenAddress: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
    },

    price: 1.0, //1.38, //0.72,
    poolIdx: 400,
    amountInBase: 8847165.444668792, //12287729.784262212 DLLR @ 1.38 DLLR/SOV //8847165.444668792 SOV @ 0.72 DLLR/SOV
    rangeMultipliers: [500000, 500001],
  },
  {
    baseToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    quoteToken: {
      tokenSymbol: 'USDC',
      tokenDeploymentName: 'USDC',
      isNativeToken: false,
      tokenAddress: '0xe75D0fB2C24A55cA1e3F96781a2bCC7bdba058F0',
    },
    price: 0.98, //0.72,
    poolIdx: 410,
    amountInBase: 10, //8847165.444668792, //12287729.784262212 DLLR @ 1.38 DLLR/SOV //8847165.444668792 SOV @ 0.72 DLLR/SOV
    rangeMultipliers: [100000, 100001],
  },
];
