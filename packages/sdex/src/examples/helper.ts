import { parseUnits } from 'ethers/lib/utils';

import { CrocEnv } from '../croc';

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
  amountInBase: number;
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
  range: TickRange;
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

  const mintData = await (!expectedBase
    ? pool.mintAmbientBase(amount, [limits.min, limits.max], {
        surplus: [false, false],
        lpConduit,
      })
    : pool.mintAmbientQuote(amount, [limits.min, limits.max], {
        surplus: [false, false],
        lpConduit,
      }));

  // const data = mintData.contract.interface.encodeFunctionData('userCmd', [
  //   mintData.path,
  //   mintData.calldata,
  // ]);

  console.log('to', mintData.contract.address);
  // console.log('data', data);
  console.log('calldata', mintData.calldata);
  console.log('value:', mintData.txArgs?.value?.toString());
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
  const pool = croc.pool(base, quote, poolIndex);

  const [baseToken, quoteToken] = base < quote ? [base, quote] : [quote, base];
  const poolPrice = await pool.displayPrice();

  const slippagePercentage = (poolPrice / price) * 100;
  if (slippagePercentage > slippageTolerancePercentage) {
    throw new Error(
      `burnAmbientLiquidity:: Invalid slippage for token ${baseToken} - ${quoteToken}, expected ${slippageTolerancePercentage}% got ${slippagePercentage}%, with expected price: ${price}, got ${poolPrice}`,
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
    range,
  }: CreateConcentratedPositionProps,
) {
  const pool = env.pool(base, quote, poolIndex);
  const [baseToken, quoteToken] = base < quote ? [base, quote] : [quote, base];

  const poolPrice = await pool.displayPrice();

  const slippagePercentage = (poolPrice / price) * 100;
  if (slippagePercentage > slippageTolerancePercentage) {
    throw new Error(
      `createPosition:: Invalid slippage for token ${baseToken} - ${quoteToken}, expected ${slippageTolerancePercentage}% got ${slippagePercentage}%, with expected price: ${price}, got ${poolPrice}`,
    );
  }

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

  const mintData = await (!expectedBase
    ? pool.mintRangeBase(amount, range, [limits.min, limits.max], {
        surplus: [false, false],
      })
    : pool.mintRangeQuote(amount, range, [limits.min, limits.max], {
        surplus: [false, false],
      }));

  // const data = mintData.contract.interface.encodeFunctionData('userCmd', [
  //   mintData.path,
  //   mintData.calldata,
  // ]);

  console.log('to', mintData.contract.address);
  // console.log('data', data);
  console.log('calldata', mintData.calldata);
  console.log('value:', mintData.txArgs?.value?.toString());
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
  const [baseToken, quoteToken] = base < quote ? [base, quote] : [quote, base];
  const poolPrice = await pool.displayPrice();

  const slippagePercentage = (poolPrice / price) * 100;
  if (slippagePercentage > slippageTolerancePercentage) {
    throw new Error(
      `burnAmbientLiquidity:: Invalid slippage for token ${baseToken} - ${quoteToken}, expected ${slippageTolerancePercentage}% got ${slippagePercentage}%, with expected price: ${price}, got ${poolPrice}`,
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
