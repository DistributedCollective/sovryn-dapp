import { AddressZero, MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';

import { Contract, BigNumber, ethers } from 'ethers';

import { MAX_LIQ } from './constants';
import { CrocContext } from './context';
import { BlockTag } from './position';
import { GAS_PADDING } from './utils';
import { toDisplayQty, fromDisplayQty } from './utils/token';

/* Type representing specified token quantities. This type can either represent the raw non-decimalized
 * on-chain value in wei, if passed as a BigNuber. Or it can represent the decimalized value if passed
 * as a string or Javascript float. */
export type TokenQty = BigNumber | string | number;

type ApproveParams = {
  address: string;
  weiQty: BigNumber;
  gasLimit: BigNumber;
};

/* General top-level class for interacting with specific ERC20 tokens. Handles functionality for
 * approval, getting token balances both in wallet and on dex, and display/decimalization. */
export class CrocTokenView {
  /* Creates a new CrocTokenView for specificied token address.
   *
   * @param context The CrocContext environment context. Specific to a given chain.
   * @param tokenAddr The address of the token contract. Use zero address for native ETH token. */
  constructor(context: Promise<CrocContext>, tokenAddr: string) {
    this.context = context;
    this.tokenAddr = tokenAddr;
    this.isNativeEth = tokenAddr == AddressZero;
    if (this.isNativeEth) {
      this.decimals = Promise.resolve(18);
    } else {
      this.decimals = this.resolve().then(c => c.decimals());
    }
  }

  /* Sends a signed transaction to approve the CrocSwap contract for the ERC20 token contract.
   *
   * @param approveQty Optional arugment to specify the quantity to approve. Defaults to 2^120
   *                   if unspecified. */
  async approve(approveQty?: TokenQty): Promise<ApproveParams | undefined> {
    return this.approveParams((await this.context).dex.address, approveQty);
  }

  async approveRouter(
    approveQty?: TokenQty,
  ): Promise<TransactionResponse | undefined> {
    const router = (await this.context).router;
    return router && this.approveAddr(router.address, approveQty);
  }

  public async approveParams(
    addr: string,
    approveQty?: TokenQty,
  ): Promise<ApproveParams | undefined> {
    if (this.isNativeEth) {
      return undefined;
    }

    const weiQty = approveQty ? await this.normQty(approveQty) : MaxUint256;

    // We want to hardcode the gas limit, so we can manually pad it from the estimated
    // transaction. The default value is low gas calldata, but Metamask and other wallets
    // will often ask users to change the approval amount. Without the padding, approval
    // transactions can run out of gas.
    // const gasEst = (await this.resolveWrite()).estimateGas.approve(
    //   addr,
    //   weiQty,
    // );

    return {
      address: addr,
      weiQty,
      gasLimit:
        BigNumber.from(200_000) /*, gasLimit: (await gasEst).add(2000) */,
    };
  }

  private async approveAddr(
    addr: string,
    approveQty?: TokenQty,
  ): Promise<TransactionResponse | undefined> {
    if (this.isNativeEth) {
      return undefined;
    }

    const weiQty = approveQty ? await this.normQty(approveQty) : MaxUint256;

    // We want to hardcode the gas limit, so we can manually pad it from the estimated
    // transaction. The default value is low gas calldata, but Metamask and other wallets
    // will often ask users to change the approval amount. Without the padding, approval
    // transactions can run out of gas.
    const gasEst = (await this.resolveWrite()).estimateGas.approve(
      addr,
      weiQty,
    );

    return (await this.resolveWrite()).approve(addr, weiQty, {
      gasLimit: (await gasEst).add(15000),
    });
  }

  async approveBypassRouter(): Promise<TransactionResponse | undefined> {
    const router = (await this.context).router;
    if (!router) {
      return undefined;
    }

    const abiCoder = new ethers.utils.AbiCoder();
    const MANY_CALLS = 1000000000;
    const HOT_PROXY_IDX = 1;
    const COLD_PROXY_IDX = 3;
    const cmd = abiCoder.encode(
      ['uint8', 'address', 'uint32', 'uint16[]'],
      [72, router.address, MANY_CALLS, [HOT_PROXY_IDX]],
    );
    return (await this.context).dex.userCmd(COLD_PROXY_IDX, cmd);
  }

  async wallet(
    address: string,
    block: BlockTag = 'latest',
  ): Promise<BigNumber> {
    if (this.isNativeEth) {
      return (await this.context).provider.getBalance(address, block);
    } else {
      return (await this.resolve()).balanceOf(address, { blockTag: block });
    }
  }

  async walletDisplay(
    address: string,
    block: BlockTag = 'latest',
  ): Promise<string> {
    const balance = this.wallet(address, block);
    return toDisplayQty(await balance, await this.decimals);
  }

  async balance(
    address: string,
    block: BlockTag = 'latest',
  ): Promise<BigNumber> {
    return (await this.context).query.querySurplus(address, this.tokenAddr, {
      blockTag: block,
    });
  }

  async balanceDisplay(
    address: string,
    block: BlockTag = 'latest',
  ): Promise<string> {
    const balance = this.balance(address, block);
    return toDisplayQty(await balance, await this.decimals);
  }

  async allowance(address: string): Promise<BigNumber> {
    if (this.isNativeEth) {
      return MAX_LIQ;
    }
    return (await this.resolve()).allowance(
      address,
      (await this.context).dex.address,
    );
  }

  async roundQty(qty: TokenQty): Promise<BigNumber> {
    if (typeof qty === 'number' || typeof qty === 'string') {
      return this.normQty(this.truncFraction(qty, await this.decimals));
    } else {
      return qty;
    }
  }

  private truncFraction(qty: string | number, decimals: number): number {
    if (typeof qty === 'number') {
      const exp = Math.pow(10, decimals);
      return Math.floor(qty * exp) / exp;
    } else {
      return this.truncFraction(parseFloat(qty), decimals);
    }
  }

  async normQty(qty: TokenQty): Promise<BigNumber> {
    if (typeof qty === 'number' || typeof qty === 'string') {
      return fromDisplayQty(qty.toString(), await this.decimals);
    } else {
      return qty;
    }
  }

  async toDisplay(qty: TokenQty): Promise<string> {
    if (typeof qty === 'number' || typeof qty === 'string') {
      return qty.toString();
    } else {
      return toDisplayQty(qty, await this.decimals);
    }
  }

  private async resolve(): Promise<Contract> {
    return (await this.context).erc20Read.attach(this.tokenAddr);
  }

  private async resolveWrite(): Promise<Contract> {
    return (await this.context).erc20Write.attach(this.tokenAddr);
  }

  async deposit(qty: TokenQty, recv: string): Promise<TransactionResponse> {
    return this.surplusOp(73, qty, recv, this.isNativeEth);
  }

  async withdraw(qty: TokenQty, recv: string): Promise<TransactionResponse> {
    return this.surplusOp(74, qty, recv);
  }

  async transfer(qty: TokenQty, recv: string): Promise<TransactionResponse> {
    return this.surplusOp(75, qty, recv);
  }

  private async surplusOp(
    subCode: number,
    qty: TokenQty,
    recv: string,
    useMsgVal: boolean = false,
  ): Promise<TransactionResponse> {
    const abiCoder = new ethers.utils.AbiCoder();
    const weiQty = this.normQty(qty);
    const cmd = abiCoder.encode(
      ['uint8', 'address', 'uint128', 'address'],
      [subCode, recv, await weiQty, this.tokenAddr],
    );

    const txArgs = useMsgVal ? { value: await weiQty } : {};
    const cntx = await this.context;
    const gasEst = await cntx.dex.estimateGas.userCmd(
      cntx.chain.proxyPaths.cold,
      cmd,
      txArgs,
    );
    Object.assign(txArgs, { gasLimit: gasEst.add(GAS_PADDING) });
    return cntx.dex.userCmd(cntx.chain.proxyPaths.cold, cmd, txArgs);
  }

  readonly tokenAddr: string;
  readonly context: Promise<CrocContext>;
  readonly decimals: Promise<number>;
  readonly isNativeEth: boolean;
}

export class CrocEthView extends CrocTokenView {
  constructor(context: Promise<CrocContext>) {
    super(context, AddressZero);
  }

  /* Returns the amount needed to attach to msg.value when spending
   * ETH from surplus collateral. (I.e. the difference between the
   * two, or 0 if surplus collateral is sufficient) */
  async msgValOverSurplus(ethNeeded: BigNumber): Promise<BigNumber> {
    const sender = (await this.context).senderAddr;

    if (!sender) {
      console.warn('No sender address known, returning 0');
      return BigNumber.from(0);
    }

    const ethView = new CrocTokenView(this.context, AddressZero);
    const surpBal = await ethView.balance(sender);

    const hasEnough = surpBal.gt(ethNeeded);
    return hasEnough ? BigNumber.from(0) : ethNeeded.sub(surpBal);
  }
}

export function sortBaseQuoteViews(
  tokenA: CrocTokenView,
  tokenB: CrocTokenView,
): [CrocTokenView, CrocTokenView] {
  return tokenA.tokenAddr.toLowerCase() < tokenB.tokenAddr.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
}
