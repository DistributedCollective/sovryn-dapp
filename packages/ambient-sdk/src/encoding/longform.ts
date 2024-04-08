import { BigNumber, BytesLike, ethers, BigNumberish } from 'ethers';

export class OrderDirective {
  constructor(openToken: string) {
    this.open = simpleSettle(openToken);
    this.hops = [];
  }

  encodeBytes(): BytesLike {
    const schema = encodeWord(LONG_FORM_SCHEMA_TYPE);
    const open = encodeSettlement(this.open);
    const hops = listEncoding(this.hops, encodeHop);
    return ethers.utils.concat([schema, open, hops]);
  }

  appendHop(nextToken: string): HopDirective {
    const hop = {
      settlement: simpleSettle(nextToken),
      pools: [],
      improve: { isEnabled: false, useBaseSide: false },
    };
    this.hops.push(hop);
    return hop;
  }

  appendPool(poolIdx: number): PoolDirective {
    const pool = {
      poolIdx: poolIdx,
      passive: {
        ambient: { isAdd: false, rollType: 0, liquidity: BigNumber.from(0) },
        concentrated: [],
      },
      swap: {
        isBuy: false,
        inBaseQty: false,
        rollType: 0,
        qty: BigNumber.from(0),
        limitPrice: BigNumber.from(0),
      },
      chain: { rollExit: false, swapDefer: false, offsetSurplus: false },
    };
    (this.hops.at(-1) as HopDirective).pools.push(pool);
    return pool;
  }

  appendRangeMint(
    lowTick: number,
    highTick: number,
    liq: BigNumberish,
  ): ConcentratedDirective {
    const range = {
      lowTick: lowTick,
      highTick: highTick,
      isRelTick: false,
      isAdd: true,
      rollType: 0,
      liquidity: BigNumber.from(liq).abs(),
    };
    const pool = (this.hops.at(-1) as HopDirective).pools.at(
      -1,
    ) as PoolDirective;
    pool.passive.concentrated.push(range);
    return range;
  }

  appendAmbientMint(liq: BigNumberish): AmbientDirective {
    const pool = (this.hops.at(-1) as HopDirective).pools.at(
      -1,
    ) as PoolDirective;
    pool.passive.ambient = {
      isAdd: true,
      rollType: 0,
      liquidity: BigNumber.from(liq).abs(),
    };
    return pool.passive.ambient;
  }

  appendRangeBurn(
    lowTick: number,
    highTick: number,
    liq: BigNumberish,
  ): ConcentratedDirective {
    const range = this.appendRangeMint(lowTick, highTick, liq);
    range.isAdd = false;
    return range;
  }

  open: SettlementDirective;
  hops: HopDirective[];
}

const LONG_FORM_SCHEMA_TYPE = 1;

function simpleSettle(token: string): SettlementDirective {
  return {
    token: token,
    limitQty: BigNumber.from(2).pow(125),
    dustThresh: BigNumber.from(0),
    useSurplus: false,
  };
}

export interface OrderDirective {
  open: SettlementDirective;
  hops: HopDirective[];
}

export interface SettlementDirective {
  token: string;
  limitQty: BigNumber;
  dustThresh: BigNumber;
  useSurplus: boolean;
}

export interface ImproveDirective {
  isEnabled: boolean;
  useBaseSide: boolean;
}

export interface ChainingDirective {
  rollExit: boolean;
  swapDefer: boolean;
  offsetSurplus: boolean;
}

export interface HopDirective {
  pools: PoolDirective[];
  settlement: SettlementDirective;
  improve: ImproveDirective;
}

export interface PoolDirective {
  poolIdx: BigNumberish;
  passive: PassiveDirective;
  swap: SwapDirective;
  chain: ChainingDirective;
}

export interface SwapDirective {
  isBuy: boolean;
  inBaseQty: boolean;
  qty: BigNumber;
  rollType?: number;
  limitPrice: BigNumber;
}

export interface PassiveDirective {
  ambient: AmbientDirective;
  concentrated: ConcentratedDirective[];
}

export interface AmbientDirective {
  isAdd: boolean;
  rollType?: number;
  liquidity: BigNumber;
}

export interface ConcentratedDirective {
  lowTick: number;
  highTick: number;
  isRelTick: boolean;
  isAdd: boolean;
  rollType?: number;
  liquidity: BigNumber;
}

function encodeSettlement(dir: SettlementDirective): BytesLike {
  const token = encodeToken(dir.token);
  const limit = encodeSigned(dir.limitQty);
  const dust = encodeFull(dir.dustThresh);
  const reserveFlag = encodeWord(dir.useSurplus ? 1 : 0);
  return ethers.utils.concat([token, limit, dust, reserveFlag]);
}

function encodeHop(hop: HopDirective): BytesLike {
  const pools = listEncoding(hop.pools, encodePool);
  const settle = encodeSettlement(hop.settlement);
  const improve = encodeImprove(hop.improve);
  return ethers.utils.concat([pools, settle, improve]);
}

function encodeImprove(improve: ImproveDirective): BytesLike {
  const abiCoder = new ethers.utils.AbiCoder();
  return abiCoder.encode(
    ['bool', 'bool'],
    [improve.isEnabled, improve.useBaseSide],
  );
}

function encodeChain(chain: ChainingDirective): BytesLike {
  const abiCoder = new ethers.utils.AbiCoder();
  return abiCoder.encode(
    ['bool', 'bool', 'bool'],
    [chain.rollExit, chain.swapDefer, chain.offsetSurplus],
  );
}

function encodePool(pool: PoolDirective): BytesLike {
  const poolIdx = encodeFull(pool.poolIdx);
  const passive = encodePassive(pool.passive);
  const swap = encodeSwap(pool.swap);
  const chain = encodeChain(pool.chain);
  return ethers.utils.concat([poolIdx, passive, swap, chain]);
}

function encodeSwap(swap: SwapDirective): BytesLike {
  const abiCoder = new ethers.utils.AbiCoder();
  return abiCoder.encode(
    ['bool', 'bool', 'uint8', 'uint128', 'uint128'],
    [
      swap.isBuy,
      swap.inBaseQty,
      swap.rollType ? swap.rollType : 0,
      swap.qty,
      swap.limitPrice,
    ],
  );
}

function encodePassive(passive: PassiveDirective): BytesLike {
  const ambAdd = encodeBool(passive.ambient.isAdd);
  const rollType = encodeWord(
    passive.ambient.rollType ? passive.ambient.rollType : 0,
  );
  const ambLiq = encodeFull(passive.ambient.liquidity);
  const conc = listEncoding(passive.concentrated, encodeConc);
  return ethers.utils.concat([ambAdd, rollType, ambLiq, conc]);
}

function encodeConc(conc: ConcentratedDirective): BytesLike {
  const openTick = encodeJsSigned(conc.lowTick);
  const closeTick = encodeJsSigned(conc.highTick);
  const isRelTick = encodeBool(conc.isRelTick);
  const isAdd = encodeBool(conc.isAdd);
  const rollType = encodeWord(conc.rollType ? conc.rollType : 0);
  const liq = encodeFull(conc.liquidity);
  return ethers.utils.concat([
    openTick,
    closeTick,
    isRelTick,
    isAdd,
    rollType,
    liq,
  ]);
}

function listEncoding<T>(
  elems: T[],
  encoderFn: (x: T) => BytesLike,
): BytesLike {
  const count = encodeWord(elems.length);
  const vals = elems.map(encoderFn);
  return ethers.utils.concat([count].concat(vals));
}

function encodeToken(tokenAddr: BytesLike): BytesLike {
  return ethers.utils.hexZeroPad(tokenAddr, 32);
}

function encodeFull(val: BigNumberish): BytesLike {
  const abiCoder = new ethers.utils.AbiCoder();
  return abiCoder.encode(['uint256'], [val]);
}

function encodeSigned(val: BigNumber): BytesLike {
  const abiCoder = new ethers.utils.AbiCoder();
  return abiCoder.encode(['int256'], [val]);
}

function encodeJsNum(val: number): BytesLike {
  return encodeFull(BigNumber.from(val));
}

function encodeJsSigned(val: number): BytesLike {
  return encodeSigned(BigNumber.from(val));
}

function encodeWord(val: number): BytesLike {
  return encodeJsNum(val);
}

function encodeBool(flag: boolean): BytesLike {
  return encodeWord(flag ? 1 : 0);
}
