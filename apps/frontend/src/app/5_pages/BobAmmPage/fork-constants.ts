import { ethers } from 'ethers';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { findAsset } from '../../../utils/asset';

// import { findAsset } from '../../../utils/asset';
// import { BOB_CHAIN_ID } from '../../../config/chains';

export const ETH_TOKEN = ethers.constants.AddressZero;
// Sepolia Fork
// export const USDC_TOKEN = '0x60bBA138A74C5e7326885De5090700626950d509';
// export const WBTC_TOKEN = '0xCA97CC9c1a1dfA54A252DaAFE9b5Cd1E16C81328';
// export const OKB_TOKEN = '0x3F4B6664338F23d2397c953f2AB4Ce8031663f80';

// BOB testnet
export const USDC_TOKEN = findAsset('SOV', BOB_CHAIN_ID)?.address;
export const WBTC_TOKEN = findAsset('WBTC', BOB_CHAIN_ID)?.address;
export const OKB_TOKEN = findAsset('GLD', BOB_CHAIN_ID)?.address;
