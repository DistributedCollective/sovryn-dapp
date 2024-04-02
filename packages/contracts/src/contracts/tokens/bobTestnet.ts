import { constants } from 'ethers';

export const bobTestnet: Record<string, string> = {
  btc: constants.AddressZero,
  rbtc: constants.AddressZero,
  sov: '0x5a42EF62CE3f49888284a604833466A94fd9fc36', // bbSOV
  usdc: '0x27c3321E40f039d10D5FF831F528C9CEAE601B1d', // USDC
  wbtc: '0x2868d708e442A6a940670d26100036d426F1e16b', // WBTC
  // usdcc: '0x4F245e278BEC589bAacF36Ba688B412D51874457', // USDCc
};
