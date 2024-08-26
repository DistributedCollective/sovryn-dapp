import { BigNumber, constants, ethers } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData, getAssetDataByAddress } from '@sovryn/contracts';

import { BOB_CHAIN_ID } from '../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { translations } from '../../locales/i18n';
import { TransactionFactoryOptions } from '../../types/aave';
import { LoanType } from './AaveUserReservesSummary';

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
    loanType: LoanType,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    if (token.isNative) return this.repayNative(amount, loanType, opts);
    else return this.repayToken(token, amount, loanType, opts);
  }

  private async repayToken(
    asset: AssetDetailsData,
    amount: BigNumber,
    loanType: LoanType,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    return [
      {
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
            amount.toString(),
            loanType,
            await this.signer.getAddress(),
          ],
          contract: this.Pool,
          fnName: 'repay',
          value: 0,
        },
        onComplete: opts?.onComplete,
      },
    ];
  }

  private async repayNative(
    amount: BigNumber,
    loanType: LoanType,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    const nativeAsset = await getAssetDataByAddress(
      constants.AddressZero,
      BOB_CHAIN_ID,
    );

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
            loanType,
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
