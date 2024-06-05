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

export type PriceRange = [number, number];
export type TickRange = [number, number];

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
  const [baseToken, quoteToken] =
    base.toLowerCase() < quote.toLowerCase() ? [base, quote] : [quote, base];
  const expectedBase = baseToken.toLowerCase() === base.toLowerCase();
  const priceToCheck = price; //expectedBase ? price : 1 / price;
  // const [baseToken, quoteToken] = [base, quote]; // : [quote, base];
  console.log(
    'base:',
    base,
    'quote:',
    quote,
    'baseToken:',
    baseToken,
    'quoteToken:',
    quoteToken,
    'poolIndex:',
    poolIndex,
    'price:',
    price,
    'priceToCheck:',
    priceToCheck,
    'expectedBase:',
    expectedBase,
  );
  const pool = env.pool(quote, base, poolIndex); // we need to keep original quote and base because we use display price which should be comparable to that of config

  const poolPrice = await pool.displayPrice();
  console.log('Pool Price:', poolPrice);
  // const amountAdjusted =
  //   baseToken !== base ? amountInBase : amountInBase * poolPrice;

  checkWithinSlippageTolerancePercentage(
    poolPrice,
    priceToCheck,
    slippageTolerancePercentage,
    false,
  );

  // const spotPrice = await pool.spotPrice();
  // console.log('Spot Price:', spotPrice);

  const gridSize = (await env.context).chain.gridSize;

  // const minimumPrice = spotPrice * rangeMultipliers[0];
  // const maximumPrice = spotPrice * rangeMultipliers[1];
  const minimumPrice = poolPrice * rangeMultipliers[0];
  const maximumPrice = poolPrice * rangeMultipliers[1];

  const ticks = {
    low: roundDownTick(priceToTick(minimumPrice), gridSize),
    high: roundUpTick(priceToTick(maximumPrice), gridSize),
  };

  const decimals = await (expectedBase
    ? pool.baseToken.decimals
    : pool.quoteToken.decimals);
  console.log('decimals', decimals);
  //console.log('amountAdjusted', amountAdjusted.toFixed(decimals));
  //const amount = parseUnits(amountAdjusted.toFixed(decimals), decimals);
  const amount = parseUnits(amountInBase.toFixed(decimals), decimals);

  // const amount = !expectedBase
  //   ? parseUnits(amountInBase.toString(), decimals)
  //   : parseUnits(amountAdjusted.toFixed(decimals), decimals);

  const limits = {
    min: poolPrice * (1 - SLIPPAGE_TORELANCE / 100),
    max: poolPrice * (1 + SLIPPAGE_TORELANCE / 100),
  };

  console.log('Resolved Pool:', {
    displayPrice: poolPrice,
    amount: amount.toString(),
    decimals: decimals,
  });

  const mintData = await (expectedBase
    ? pool.mintRangeBase(
        amount,
        [ticks.low, ticks.high],
        [limits.min, limits.max],
        {
          surplus: [false, false],
        },
      )
    : pool.mintRangeQuote(
        amount,
        [ticks.low, ticks.high],
        [limits.min, limits.max],
        {
          surplus: [false, false],
        },
      ));
  // const mintData = await pool.mintRangeQuote(
  //   amount,
  //   [ticks.low, ticks.high],
  //   [limits.min, limits.max],
  //   {
  //     surplus: [false, false],
  //   },
  // );
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
  console.log('Pool Price:', poolPrice);
  console.log('price:', price);
  const difference = Math.abs(poolPrice - price);
  const average = (poolPrice + price) / 2;
  const slippagePercentage = (difference / average) * 100;

  if (slippagePercentage > slippageTolerancePercentage) {
    throw new Error(
      `burnConcentratedLiquidity:: Invalid slippage for token ${base} - ${quote}, expected ${slippageTolerancePercentage}% got ${slippagePercentage}%, with expected price: ${price}, got ${poolPrice}`,
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
  const encodedData = await pool.burnRangeLiq(amount, range, limits, {});
  console.log('encoded_data: ', encodedData);
  const cntx = await croc.context;
  if (process.argv.includes('--tx')) {
    const data = cntx.dex.interface.encodeFunctionData('userCmd', [
      cntx.chain.proxyPaths.liq,
      encodedData,
    ]);
    console.log('data:', data);
  }
  console.log('-'.repeat(50));
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
