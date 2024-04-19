import { CrocEnv, toDisplayPrice } from '@sovryn/sdex';

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

  console.log('tx params', params);

  const tx = isAmbient
    ? await (isTokenAPrimaryRange ? mintAmbientQuote() : mintAmbientBase())
    : await (isTokenAPrimaryRange ? mintRangeQuote() : mintRangeBase());

  return tx;
}

// NOTE: depositSkew calculated in sdk
export const calculateSecondaryDepositQty = (
  poolPriceNonDisplay: number, // the 'scaled' or 'wei' price of the pool
  tokenADecimals: number,
  tokenBDecimals: number,
  primaryInputValueStr: string, // the token quantity entered by the user
  isTokenAPrimary: boolean,
  isTokenABase: boolean,
  isAmbientPosition: boolean,
  depositSkew?: number,
) => {
  const baseDecimals = isTokenABase ? tokenADecimals : tokenBDecimals;
  const quoteDecimals = !isTokenABase ? tokenADecimals : tokenBDecimals;

  const poolDisplayPrice = toDisplayPrice(
    poolPriceNonDisplay,
    baseDecimals,
    quoteDecimals,
  );

  const isPrimaryTokenBase =
    (isTokenAPrimary && isTokenABase) || (!isTokenAPrimary && !isTokenABase);

  let secondaryQuantity;

  const primInputValueNum = parseFloat(primaryInputValueStr);

  if (isAmbientPosition) {
    if (isPrimaryTokenBase) {
      secondaryQuantity = primInputValueNum / poolDisplayPrice;
    } else {
      secondaryQuantity = primInputValueNum / (1 / poolDisplayPrice);
    }
  } else {
    if (depositSkew) {
      if (isPrimaryTokenBase) {
        secondaryQuantity =
          primInputValueNum / (poolDisplayPrice * depositSkew);
      } else {
        secondaryQuantity =
          primInputValueNum * (poolDisplayPrice * depositSkew);
      }
    }
  }

  if (secondaryQuantity) {
    if (
      secondaryQuantity === Infinity ||
      secondaryQuantity === -Infinity ||
      isNaN(secondaryQuantity)
    ) {
      return 0;
    } else {
      return secondaryQuantity;
    }
  } else {
    return null;
  }
};
