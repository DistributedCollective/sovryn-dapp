export const bobMainnetMockAmbientPoolConfigs = [
  // SOV Pairs
  {
    baseToken: {
      tokenSymbol: 'USDT',
      tokenDeploymentName: 'MOCK_USDT',
      isNativeToken: false,
      tokenAddress: '0x26bF6A30286cE03176BF3B026Aa1f87b566ca891',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 0.47,
    poolIdx: 410,
    amountInBase: 28231,
    lpConduit: '0x1e894177d9f28CC3150ECB30E458bD9438D6C46e',
  },
  {
    baseToken: {
      tokenSymbol: 'USDC',
      tokenDeploymentName: 'MOCK_USDC',
      isNativeToken: false,
      tokenAddress: '0xBd95925809F916eCFe140f6Ef70eA43185c0ECD9',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 0.47,
    poolIdx: 410,
    amountInBase: 161363.4,
    lpConduit: '0x941fEF5263f46dc7c00CD122CcA2b8559CA8FB96',
  },
  {
    baseToken: {
      tokenSymbol: 'DAI',
      tokenDeploymentName: 'MOCK_DAI',
      isNativeToken: false,
      tokenAddress: '0x9FF262Fe3CB0c5AeDF081c580067BA846881Ed3C',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 0.47,
    poolIdx: 410,
    amountInBase: 1000,
    lpConduit: '0x83c0E209589782DDe525Dfa20Ad19a502841eAA6',
  },
  {
    baseToken: {
      tokenSymbol: 'WBTC',
      tokenDeploymentName: 'MOCK_WBTC',
      isNativeToken: false,
      tokenAddress: '0xF40A3C629661AF37010FAFbACA2eb4aA37d9abAa',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 31330,
    poolIdx: 410,
    amountInBase: 33.46968694,
    lpConduit: '0x5F17b43703713eE66bF33C940782dABEf77247a8',
  },
  {
    baseToken: {
      tokenSymbol: 'TBTC',
      tokenDeploymentName: 'MOCK_tBTC',
      isNativeToken: false,
      tokenAddress: '0x42527B3ba7100ECA14c9405016752B6121328582',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 25369,
    poolIdx: 410,
    amountInBase: '5.71385253021192418', //'5.713852530211924187'
    lpConduit: '0x9Fddb3a3D9a014A2A1F85DB3ebF6Ba5E26F4e5Ad',
  },
  {
    baseToken: {
      tokenSymbol: 'ETH',
      tokenDeploymentName: 'ETH',
      isNativeToken: true,
      tokenAddress: '0x0000000000000000000000000000000000000000',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 1522,
    poolIdx: 410,
    amountInBase: 1000,
    lpConduit: '0x0866A012aFB48e72E45ee12A4410aaa6CeD7E212',
  },
  {
    baseToken: {
      tokenSymbol: 'wstETH',
      tokenDeploymentName: 'MOCK_WSTETH',
      isNativeToken: false,
      tokenAddress: '0x7fA3A90d5B19E6E4Bf4FD6F64904f2F953F30eaf',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 1522,
    poolIdx: 410,
    amountInBase: 1000,
    lpConduit: '0x52bD02eCC0C198B5D6200f5E1eD58fefac643B88',
  },
  {
    baseToken: {
      tokenSymbol: 'rETH',
      tokenDeploymentName: 'MOCK_rETH',
      isNativeToken: false,
      tokenAddress: '0x0458b6a3b20a20D263df49D72dA928BfFe4473F3',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 1522,
    poolIdx: 410,
    amountInBase: 1000,
    lpConduit: '0x6Cd59dF6D7dE6C12A76ded2141c71c08e4b70330',
  },
];

const stablesRangeMultipliers = [0.99044, 1.01288];
export const bobMainnetMockConcentratedPoolConfigs = [
  // Additional pairs
  {
    baseToken: {
      tokenSymbol: 'DLLR',
      tokenDeploymentName: 'MOCK2_DLLR',
      isNativeToken: false,
      tokenAddress: '0xdc313cb8225d0B06B8c1F82501ED339d16e2e4e0',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'MOCK_SOV',
      isNativeToken: false,
      tokenAddress: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    },
    price: 0.47,
    poolIdx: 400,
    amountInBase: 25000,
    rangeMultipliers: [0.2, 5], // [-80%, + 5X]
  },
  {
    baseToken: {
      tokenSymbol: 'USDC',
      tokenDeploymentName: 'MOCK_USDC',
      isNativeToken: false,
      tokenAddress: '0xBd95925809F916eCFe140f6Ef70eA43185c0ECD9',
    },
    quoteToken: {
      tokenSymbol: 'USDT',
      tokenDeploymentName: 'MOCK_USDT',
      isNativeToken: false,
      tokenAddress: '0x26bF6A30286cE03176BF3B026Aa1f87b566ca891',
    },
    price: 1,
    poolIdx: 400,
    amountInBase: 1000,
    rangeMultipliers: stablesRangeMultipliers,
  },
  {
    baseToken: {
      tokenSymbol: 'USDT',
      tokenDeploymentName: 'MOCK_USDT',
      isNativeToken: false,
      tokenAddress: '0x26bF6A30286cE03176BF3B026Aa1f87b566ca891',
    },
    quoteToken: {
      tokenSymbol: 'DLLR',
      tokenDeploymentName: 'MOCK_DLLR',
      isNativeToken: false,
      tokenAddress: '0xf545c0d1BaAAF7De1d2E0B2d2c1D59a0338ecCC2',
    },
    price: 1,
    poolIdx: 400,
    amountInBase: 1000,
    rangeMultipliers: stablesRangeMultipliers,
  },
  {
    baseToken: {
      tokenSymbol: 'TBTC',
      tokenDeploymentName: 'MOCK_tBTC',
      isNativeToken: false,
      tokenAddress: '0x42527B3ba7100ECA14c9405016752B6121328582',
    },
    quoteToken: {
      tokenSymbol: 'WBTC',
      tokenDeploymentName: 'MOCK_WBTC',
      isNativeToken: false,
      tokenAddress: '0xF40A3C629661AF37010FAFbACA2eb4aA37d9abAa',
    },
    price: 1,
    poolIdx: 400,
    amountInBase: 1.5,
    rangeMultipliers: stablesRangeMultipliers,
  },
];

export const bobMainnetAmbientPoolConfigs = [
  {
    baseToken: {
      tokenSymbol: 'USDT',
      tokenDeploymentName: 'USDT',
      isNativeToken: false,
      tokenAddress: '0x05d032ac25d322df992303dca074ee7392c117b9',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 0.5618,
    poolIdx: 410,
    amountInBase: 171990.544426,
    lpConduit: '',
  },
  {
    baseToken: {
      tokenSymbol: 'USDC',
      tokenDeploymentName: 'USDC',
      isNativeToken: false,
      tokenAddress: '0xe75D0fB2C24A55cA1e3F96781a2bCC7bdba058F0',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 0.5618,
    poolIdx: 410,
    amountInBase: 90734.55794,
    lpConduit: '',
  },
  {
    baseToken: {
      tokenSymbol: 'DAI',
      tokenDeploymentName: 'DAI',
      isNativeToken: false,
      tokenAddress: '0x6c851f501a3f24e29a8e39a29591cddf09369080',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 0.5618,
    poolIdx: 410,
    amountInBase: '7680.524203026422955348',
    lpConduit: '',
  },
  {
    baseToken: {
      tokenSymbol: 'WBTC',
      tokenDeploymentName: 'WBTC',
      isNativeToken: false,
      tokenAddress: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 32540.13,
    poolIdx: 410,
    amountInBase: 16.75350222,
    lpConduit: '',
  },
  {
    baseToken: {
      tokenSymbol: 'TBTC',
      tokenDeploymentName: 'tBTC',
      isNativeToken: false,
      tokenAddress: '0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 32523.39,
    poolIdx: 410,
    amountInBase: '3.191973864506563562', //'3.191973864506563562'
    lpConduit: '',
  },
  {
    baseToken: {
      tokenSymbol: 'ETH',
      tokenDeploymentName: 'ETH',
      isNativeToken: true,
      tokenAddress: '0x0000000000000000000000000000000000000000',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 1651.64,
    poolIdx: 410,
    amountInBase: 245.68447745,
    lpConduit: '',
  },
  {
    baseToken: {
      tokenSymbol: 'wstETH',
      tokenDeploymentName: 'WSTETH',
      isNativeToken: false,
      tokenAddress: '0x85008aE6198BC91aC0735CB5497CF125ddAAc528',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 1915.46,
    poolIdx: 410,
    amountInBase: '6.407055136575428846',
    lpConduit: '',
  },
  {
    baseToken: {
      tokenSymbol: 'rETH',
      tokenDeploymentName: 'rETH',
      isNativeToken: false,
      tokenAddress: '0xb5686c4f60904ec2bda6277d6fe1f7caa8d1b41a',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 1824.02,
    poolIdx: 410,
    amountInBase: '2.971189663954734036',
    lpConduit: '',
  },
];

export const bobMainnetConcentratedPoolConfigs = [
  // Additional pairs
  {
    baseToken: {
      tokenSymbol: 'DLLR',
      tokenDeploymentName: 'DLLR',
      isNativeToken: false,
      tokenAddress: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
    },
    quoteToken: {
      tokenSymbol: 'SOV',
      tokenDeploymentName: 'SOV',
      isNativeToken: false,
      tokenAddress: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    },
    price: 0.47,
    poolIdx: 400,
    amountInBase: 1000,
    rangeMultipliers: [0.2, 5], // [-80%, + 5X]
  },
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
    amountInBase: 1000,
    rangeMultipliers: stablesRangeMultipliers,
  },
  {
    baseToken: {
      tokenSymbol: 'USDT',
      tokenDeploymentName: 'USDT',
      isNativeToken: false,
      tokenAddress: '0x05d032ac25d322df992303dca074ee7392c117b9',
    },
    quoteToken: {
      tokenSymbol: 'DLLR',
      tokenDeploymentName: 'DLLR',
      isNativeToken: false,
      tokenAddress: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
    },
    price: 1,
    poolIdx: 400,
    amountInBase: 1000,
    rangeMultipliers: stablesRangeMultipliers,
  },
  {
    baseToken: {
      tokenSymbol: 'TBTC',
      tokenDeploymentName: 'tBTC',
      isNativeToken: false,
      tokenAddress: '0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2',
    },
    quoteToken: {
      tokenSymbol: 'WBTC',
      tokenDeploymentName: 'WBTC',
      isNativeToken: false,
      tokenAddress: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
    },
    price: 1,
    poolIdx: 400,
    amountInBase: 1000,
    rangeMultipliers: stablesRangeMultipliers,
  },
];
