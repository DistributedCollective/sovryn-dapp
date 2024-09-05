import { BigNumber, constants, Contract, ethers } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData, getAssetDataByAddress } from '@sovryn/contracts';

import { BOB_CHAIN_ID } from '../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { config } from '../../constants/aave';
import { translations } from '../../locales/i18n';
import { BorrowRateMode, TransactionFactoryOptions } from '../../types/aave';
import { prepareApproveTransaction } from '../transactions';

export class AaveRepayTransactionsFactory {
  private readonly Pool: ethers.Contract;
  private readonly WETHGateway: ethers.Contract;

  constructor(
    private readonly PoolAddress: string,
    private readonly WETHGatewayAddress: string,
    private readonly signer: ethers.Signer,
  ) {
    this.Pool = new ethers.Contract(
      this.PoolAddress,
      [
        'function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf)',
      ],
      this.signer,
    );

    this.WETHGateway = new ethers.Contract(
      this.WETHGatewayAddress,
      [
        'function repayETH(address pool, uint256 amount, uint256 rateMode, address onBehalfOf) payable',
      ],
      this.signer,
    );
  }

  async repay(
    token: AssetDetailsData,
    amount: BigNumber,
    isEntireDebt: boolean,
    borrowRateMode: BorrowRateMode,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    if (
      token.isNative ||
      token.address.toLowerCase() === config.WETHAddress.toLowerCase()
    ) {
      return this.repayNative(amount, isEntireDebt, borrowRateMode, opts);
    } else
      return this.repayToken(token, amount, isEntireDebt, borrowRateMode, opts);
  }

  private async repayToken(
    asset: AssetDetailsData,
    amount: BigNumber,
    isEntireDebt: boolean,
    borrowRateMode: BorrowRateMode,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    const approval = await prepareApproveTransaction({
      spender: this.PoolAddress,
      token: asset.symbol,
      contract: new Contract(asset.address, asset.abi, this.signer),
      amount: constants.MaxUint256,
      chain: BOB_CHAIN_ID,
    });
    const transactions: Transaction[] = approval ? [approval] : [];

    transactions.push({
      title: t(translations.aavePage.tx.repayTitle, {
        symbol: asset.symbol,
      }),
      subtitle: t(translations.aavePage.tx.repaySubtitle, {
        symbol: asset.symbol,
        amount: ethers.utils.formatUnits(amount, asset.decimals),
      }),
      request: {
        type: TransactionType.signTransaction,
        args: [
          asset.address,
          isEntireDebt ? constants.MaxUint256.toString() : amount.toString(),
          borrowRateMode,
          await this.signer.getAddress(),
        ],
        contract: this.Pool,
        fnName: 'repay',
        value: 0,
      },
      onComplete: opts?.onComplete,
    });

    return transactions;
  }

  private async repayNative(
    amount: BigNumber,
    isEntireDebt: boolean,
    borrowRateMode: BorrowRateMode,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    const nativeAsset = await getAssetDataByAddress(
      constants.AddressZero,
      BOB_CHAIN_ID,
    );
    amount = isEntireDebt ? amount.add('1000000') : amount;

    return [
      {
        title: t(translations.aavePage.tx.repayTitle, {
          symbol: nativeAsset.symbol,
        }),
        subtitle: t(translations.aavePage.tx.repaySubtitle, {
          symbol: nativeAsset.symbol,
          amount: ethers.utils.formatUnits(amount, nativeAsset.decimals),
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [
            this.PoolAddress,
            amount.toString(),
            borrowRateMode,
            await this.signer.getAddress(),
          ],
          contract: this.WETHGateway,
          fnName: 'repayETH',
          value: amount.toString(),
        },
        onComplete: opts?.onComplete,
      },
    ];
  }
}
