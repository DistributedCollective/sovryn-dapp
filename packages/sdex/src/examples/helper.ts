import { parseUnits } from 'ethers/lib/utils';

import { MAX_TICK, MIN_TICK } from '../constants';
import { CrocEnv } from '../croc';
import { priceToTick } from '../utils';

export interface IBurnAmbientLiquidity {
  base: string;
  quote: string;
  poolIndex: number;
  amountInBase: number;
  lpConduit?: string;
  price: number;
  slippageTolerancePercentage: number;
}

export interface CreateAmbientPositionProps {
  base: string;
  quote: string;
  poolIndex: number;
  amountInBase: number | string;
  lpConduit?: string;
  range?: TickRange;
  price: number;
  slippageTolerancePercentage: number;
}

export interface IBurnConcentratedLiquidity {
  base: string;
  quote: string;
  poolIndex: number;
  amountInBase: number;
  range: TickRange;
  price: number;
  slippageTolerancePercentage: number;
}

export interface CreateConcentratedPositionProps {
  base: string;
  quote: string;
  poolIndex: number;
  amountInBase: number;
  rangeMultipliers: number[];
  price: number;
  slippageTolerancePercentage: number;
}

type PriceRange = [number, number];
type TickRange = [number, number];

const SLIPPAGE_TORELANCE = 0.05; // 0.05%

function checkWithinSlippageTolerancePercentage(
  price1: number,
  price2: number,
  slippageMaxPercentage: number,
  log = true,
) {
  // Calculate the percentage difference
  const difference = Math.abs(price1 - price2);
  const average = (price1 + price2) / 2;

  const percentageDifference = (difference / average) * 100;
  console.log('price1:', price1);
  console.log('price2:', price2);
  if (log) console.log('slippage percentage diff: ', percentageDifference);
  // Check if the percentage difference is within 10%

  if (percentageDifference > slippageMaxPercentage) {
    throw new Error(
      `createPosition:: Invalid slippage price between: ${price1} - ${price2}, percentageDifference: ${percentageDifference}`,
    );
  }

  return percentageDifference <= slippageMaxPercentage;
}

export async function createPositionAmbientLiquidity(
  env: CrocEnv,
  {
    base,
    quote,
    poolIndex,
    amountInBase,
    lpConduit,
    price,
    slippageTolerancePercentage,
  }: CreateAmbientPositionProps,
) {
  const pool = env.pool(base, quote, poolIndex);
  // const [baseToken, quoteToken] = base < quote ? [base, quote] : [quote, base];

  const poolPrice = await pool.displayPrice();

  console.log(`On chain price, 1 ${base}: ${poolPrice} ${quote}`);

  console.log(`Checking slippage for token ${base} - ${quote}`);
  checkWithinSlippageTolerancePercentage(
    poolPrice,
    price,
    slippageTolerancePercentage,
    false,
  );

  const expectedBase =
    pool.baseToken.tokenAddr.toLowerCase() === base.toLowerCase();

  const decimals = await (expectedBase
    ? pool.baseToken.decimals
    : pool.quoteToken.decimals);

  const amount = parseUnits(amountInBase.toString(), decimals);

  const limits = {
    min: poolPrice * (1 - SLIPPAGE_TORELANCE / 100),
    max: poolPrice * (1 + SLIPPAGE_TORELANCE / 100),
  };

  console.log('Resolved Pool:', {
    displayPrice: poolPrice,
    amount: amount.toString(),
    decimals: decimals,
  });
  console.log('expectedBase:', expectedBase);
  const mintData = await pool.mintAmbientQuote(
    amount,
    [limits.min, limits.max],
    {
      surplus: [false, false],
      lpConduit,
    },
  );

  // const mintData = await (!expectedBase
  //   ? pool.mintAmbientBase(amount, [limits.min, limits.max], {
  //       surplus: [false, false],
  //       lpConduit,
  //     })
  //   : pool.mintAmbientQuote(amount, [limits.min, limits.max], {
  //       surplus: [false, false],
  //       lpConduit,
  //     }));
  // const mintData = await (!expectedBase
  //   ? pool.encodeMintAmbientBase(amount, [limits.min, limits.max], {
  //       surplus: [false, false],
  //       lpConduit,
  //     })
  //   : pool.encodeMintAmbientQuote(amount, [limits.min, limits.max], {
  //       surplus: [false, false],
  //       lpConduit,
  //     }));

  // const data = mintData.contract.interface.encodeFunctionData('userCmd', [
  //   mintData.path,
  //   mintData.calldata,
  // ]);

  console.log('to', mintData.contract.address);
  console.log('calldata', mintData.calldata);
  console.log('value:', mintData.txArgs?.value?.toString());

  if (process.argv.includes('--tx')) {
    const data = mintData.contract.interface.encodeFunctionData('userCmd', [
      mintData.path,
      mintData.calldata,
    ]);
    console.log('data:', data);
  }

  console.log('-'.repeat(50));
}

export async function burnAmbientLiquidity(
  croc: CrocEnv,
  {
    base,
    quote,
    amountInBase,
    poolIndex,
    lpConduit,
    price,
    slippageTolerancePercentage,
  }: IBurnAmbientLiquidity,
) {
  //   const [baseToken, quoteToken] = base < quote ? [base, quote] : [quote, base];
  const [baseToken, quoteToken] = [base, quote]; // : [quote, base];
  const pool = croc.pool(baseToken, quoteToken, poolIndex);

  const poolPrice = await pool.displayPrice();

  const slippagePercentage = (poolPrice / price) * 100;
  if (slippagePercentage > slippageTolerancePercentage) {
    throw new Error(
      `burnAmbientLiquidity:: Invalid slippage for token ${base} - ${quote}, expected ${slippageTolerancePercentage}% got ${slippagePercentage}%, with expected price: ${price}, got ${poolPrice}`,
    );
  }

  const expectedBase =
    pool.baseToken.tokenAddr.toLowerCase() === base.toLowerCase();

  const decimals = await (expectedBase
    ? pool.baseToken.decimals
    : pool.quoteToken.decimals);

  const amountInBaseStr =
    typeof amountInBase !== 'string' ? amountInBase.toString() : amountInBase;

  const amount = parseUnits(amountInBaseStr, decimals);

  const limits: PriceRange = [
    poolPrice * (1 - SLIPPAGE_TORELANCE / 100),
    poolPrice * (1 + SLIPPAGE_TORELANCE / 100),
  ];
  console.log('pool price:', poolPrice);
  console.log(
    'encoded_data: ',
    await pool.burnAmbientLiq(amount, limits, {
      lpConduit: lpConduit,
    }),
  );
}

export async function createPositionConcentratedLiquidity(
  env: CrocEnv,
  {
    base,
    quote,
    poolIndex,
    amountInBase,
    price,
    slippageTolerancePercentage,
    rangeMultipliers,
  }: CreateConcentratedPositionProps,
) {
  // const [baseToken, quoteToken] = base < quote ? [base, quote] : [quote, base];
  const [baseToken, quoteToken] = [base, quote]; // : [quote, base];
  const pool = env.pool(baseToken, quoteToken, poolIndex);

  const poolPrice = await pool.displayPrice();

  checkWithinSlippageTolerancePercentage(
    poolPrice,
    price,
    slippageTolerancePercentage,
    false,
  );

  const spotPrice = await pool.spotPrice();

  const gridSize = (await env.context).chain.gridSize;

  const minimumPrice = spotPrice * rangeMultipliers[0];
  const maximumPrice = spotPrice * rangeMultipliers[1];

  const ticks = {
    low: roundDownTick(priceToTick(minimumPrice), gridSize),
    high: roundUpTick(priceToTick(maximumPrice), gridSize),
  };

  const expectedBase =
    pool.baseToken.tokenAddr.toLowerCase() === base.toLowerCase();

  const decimals = await (expectedBase
    ? pool.baseToken.decimals
    : pool.quoteToken.decimals);

  const amount = parseUnits(amountInBase.toString(), decimals);

  const limits = {
    min: poolPrice * (1 - SLIPPAGE_TORELANCE / 100),
    max: poolPrice * (1 + SLIPPAGE_TORELANCE / 100),
  };

  console.log('Resolved Pool:', {
    displayPrice: poolPrice,
    amount: amount.toString(),
    decimals: decimals,
  });

  // const mintData = await (!expectedBase
  //   ? pool.mintRangeBase(
  //       amount,
  //       [ticks.low, ticks.high],
  //       [limits.min, limits.max],
  //       {
  //         surplus: [false, false],
  //       },
  //     )
  //   : pool.mintRangeQuote(
  //       amount,
  //       [ticks.low, ticks.high],
  //       [limits.min, limits.max],
  //       {
  //         surplus: [false, false],
  //       },
  //     ));
  const mintData = await pool.mintRangeQuote(
    amount,
    [ticks.low, ticks.high],
    [limits.min, limits.max],
    {
      surplus: [false, false],
    },
  );
  console.log('expectedBase:', expectedBase);
  console.log('to', mintData.contract.address);
  console.log('calldata', mintData.calldata);
  console.log('value:', mintData.txArgs?.value?.toString());

  if (process.argv.includes('--tx')) {
    const data = mintData.contract.interface.encodeFunctionData('userCmd', [
      mintData.path,
      mintData.calldata,
    ]);
    console.log('data:', data);
  }

  console.log('-'.repeat(50));
}

export async function burnConcentratedLiquidity(
  croc: CrocEnv,
  {
    base,
    quote,
    amountInBase,
    poolIndex,
    range,
    price,
    slippageTolerancePercentage,
  }: IBurnConcentratedLiquidity,
) {
  const pool = croc.pool(base, quote, poolIndex);
  //   const [baseToken, quoteToken] = base < quote ? [base, quote] : [quote, base];
  const poolPrice = await pool.displayPrice();

  const slippagePercentage = (poolPrice / price) * 100;
  if (slippagePercentage > slippageTolerancePercentage) {
    throw new Error(
      `burnAmbientLiquidity:: Invalid slippage for token ${base} - ${quote}, expected ${slippageTolerancePercentage}% got ${slippagePercentage}%, with expected price: ${price}, got ${poolPrice}`,
    );
  }

  const expectedBase =
    pool.baseToken.tokenAddr.toLowerCase() === base.toLowerCase();

  const decimals = await (expectedBase
    ? pool.baseToken.decimals
    : pool.quoteToken.decimals);

  const amount = parseUnits(amountInBase.toString(), decimals);

  const limits: PriceRange = [
    poolPrice * (1 - SLIPPAGE_TORELANCE / 100),
    poolPrice * (1 + SLIPPAGE_TORELANCE / 100),
  ];
  console.log('pool price:', poolPrice);
  console.log(
    'encoded_data: ',
    await pool.burnRangeLiq(amount, range, limits, {}),
  );
}

export function roundDownTick(lowTick: number, nTicksGrid: number): number {
  const tickGrid = Math.floor(lowTick / nTicksGrid) * nTicksGrid;
  const horizon = Math.floor(MIN_TICK / nTicksGrid) * nTicksGrid;
  return Math.max(tickGrid, horizon);
}

export function roundUpTick(highTick: number, nTicksGrid: number): number {
  const tickGrid = Math.ceil(highTick / nTicksGrid) * nTicksGrid;
  const horizon = Math.ceil(MAX_TICK / nTicksGrid) * nTicksGrid;
  return Math.min(tickGrid, horizon);
}
