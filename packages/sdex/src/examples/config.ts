export const bobMainnetPoolConfigs = [
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
    amountInBase: 1000, // NOTE: NEED TO MAKE SURE THAT WE PASS THE CORRECT AMOUNT AS THE BASE AMOUNT, WHICH MEANS WE NEED TO KNOW THE BASE AMOUNT IN ADVANCED
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
    amountInBase: 1000,
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
    price: 31330, // paired to SOV (eDLLR/eSOV) --> means 1 eDLLR = 0.47 eSOV
    poolIdx: 410,
    amountInBase: 1000,
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
    amountInBase: 1000,
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
    price: 1522, // paired to SOV (ETH/eSOV) --> means 1 ETH = 1522 eSOV
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
