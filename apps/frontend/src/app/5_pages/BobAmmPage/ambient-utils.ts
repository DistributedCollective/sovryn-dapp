import { CrocEnv } from '@sovryn/sdex';

type RangePositionTokenInfo = {
  address: string;
  qty: number;
  isWithdrawFromDexChecked: boolean;
};

export interface CreateRangePositionParams {
  crocEnv: CrocEnv;
  isAmbient: boolean;
  slippageTolerancePercentage: number;
  tokenA: RangePositionTokenInfo;
  tokenB: RangePositionTokenInfo;
  isTokenAPrimaryRange: boolean; // TODO: better name for this variable
  tick: { low: number; high: number };
  lpConduit?: string;
}

export async function createRangePositionTx(params: CreateRangePositionParams) {
  const {
    crocEnv,
    isAmbient,
    slippageTolerancePercentage,
    tokenA,
    tokenB,
    isTokenAPrimaryRange,
    tick,
    lpConduit,
  } = params;

  const pool = crocEnv.pool(tokenA.address, tokenB.address);
  const poolPrice = await pool.displayPrice();

  const price = {
    min: poolPrice * (1 - slippageTolerancePercentage / 100),
    max: poolPrice * (1 + slippageTolerancePercentage / 100),
  };

  const mintAmbientQuote = () =>
    pool.mintAmbientQuote(tokenA.qty, [price.min, price.max], {
      surplus: [
        tokenA.isWithdrawFromDexChecked,
        tokenB.isWithdrawFromDexChecked,
      ],
      lpConduit,
    });

  const mintAmbientBase = () =>
    pool.mintAmbientBase(tokenB.qty, [price.min, price.max], {
      surplus: [
        tokenA.isWithdrawFromDexChecked,
        tokenB.isWithdrawFromDexChecked,
      ],
      lpConduit,
    });

  const mintRangeQuote = () => {
    return pool.mintRangeQuote(
      tokenA.qty,
      [tick.low, tick.high],
      [price.min, price.max],
      {
        surplus: [
          tokenA.isWithdrawFromDexChecked,
          tokenB.isWithdrawFromDexChecked,
        ],
      },
    );
  };

  const mintRangeBase = () => {
    return pool.mintRangeBase(
      tokenB.qty,
      [tick.low, tick.high],
      [price.min, price.max],
      {
        surplus: [
          tokenA.isWithdrawFromDexChecked,
          tokenB.isWithdrawFromDexChecked,
        ],
      },
    );
  };

  const tx = isAmbient
    ? await (isTokenAPrimaryRange ? mintAmbientQuote() : mintAmbientBase())
    : await (isTokenAPrimaryRange ? mintRangeQuote() : mintRangeBase());

  return tx;
}
