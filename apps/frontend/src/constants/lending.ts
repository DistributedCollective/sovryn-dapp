import { decimalic } from '../utils/math';

// TODO: This will be read from the subgraph/smart contracts in the future
export const MINIMUM_COLLATERAL_RATIO_LENDING_POOLS = decimalic(1.5); // 150%
export const MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV = decimalic(3); // 300%
export const MINIMUM_COLLATERAL_RATIO_BORROWING = decimalic(1.15); // 115%
