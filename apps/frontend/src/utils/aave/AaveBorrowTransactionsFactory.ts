import { BigNumber, constants, ethers } from 'ethers';
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

export class AaveBorrowTransactionsFactory {
  private readonly Pool: ethers.Contract;
  private readonly WETHGateway: ethers.Contract;
  private readonly VariableDebtWETHToken: ethers.Contract;

  constructor(
    private readonly PoolAddress: string,
    private readonly WETHGatewayAddress: string,
    private readonly VariableDebtWETHAddress: string,
    private readonly signer: ethers.Signer,
  ) {
    this.Pool = new ethers.Contract(
      this.PoolAddress,
      [
        'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)',
        'function swapBorrowRateMode(address asset, uint256 rateMode)',
      ],
      this.signer,
    );

    this.WETHGateway = new ethers.Contract(
      this.WETHGatewayAddress,
      [
        'function borrowETH(address pool, uint256 amount, uint256 interestRateMode, uint16 referralCode)',
      ],
      this.signer,
    );

    this.VariableDebtWETHToken = new ethers.Contract(
      this.VariableDebtWETHAddress,
      ['function approveDelegation(address delegatee, uint256 amount)'],
      this.signer,
    );
  }

  async borrow(
    asset: AssetDetailsData,
    amount: BigNumber,
    rateMode: BorrowRateMode,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    if (
      asset.isNative ||
      asset.address.toLowerCase() === config.WETHAddress.toLowerCase()
    ) {
      return this.borrowNative(amount, rateMode, opts);
    } else return this.borrowToken(asset, amount, rateMode, opts);
  }

  async swapBorrowRateMode(
    asset: AssetDetailsData,
    currentRateMode: BorrowRateMode,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    return [
      {
        title: t(translations.aavePage.tx.swapBorrowRateModeTitle),
        subtitle: t(translations.aavePage.tx.swapBorrowRateModeSubtitle, {
          symbol: asset.symbol,
          mode:
            currentRateMode === BorrowRateMode.VARIABLE ? 'stable' : 'variable',
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [asset.address, currentRateMode],
          contract: this.Pool,
          fnName: 'swapBorrowRateMode',
        },
        onComplete: opts?.onComplete,
      },
    ];
  }

  private async borrowToken(
    asset: AssetDetailsData,
    amount: BigNumber,
    rateMode: BorrowRateMode,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    return [
      {
        title: t(translations.aavePage.tx.borrowTitle, {
          symbol: asset.symbol,
        }),
        subtitle: t(translations.aavePage.tx.borrowSubtitle, {
          symbol: asset.symbol,
          amount: ethers.utils.formatUnits(amount, asset.decimals),
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [
            asset.address,
            amount.toString(),
            rateMode,
            0,
            await this.signer.getAddress(),
          ],
          contract: this.Pool,
          fnName: 'borrow',
        },
        onComplete: opts?.onComplete,
      },
    ];
  }

  private async borrowNative(
    amount: BigNumber,
    rateMode: BorrowRateMode,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    const nativeAsset = await getAssetDataByAddress(
      constants.AddressZero,
      BOB_CHAIN_ID,
    );

    return [
      {
        title: t(translations.aavePage.tx.approveBorrowDelegationTitle, {
          symbol: nativeAsset.symbol,
        }),
        subtitle: t(translations.aavePage.tx.approveBorrowDelegationSubtitle, {
          symbol: nativeAsset.symbol,
          amount: ethers.utils.formatUnits(amount, nativeAsset.decimals),
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [this.WETHGatewayAddress, amount.toString()],
          contract: this.VariableDebtWETHToken,
          fnName: 'approveDelegation',
        },
      },
      {
        title: t(translations.aavePage.tx.borrowTitle, {
          symbol: nativeAsset.symbol,
        }),
        subtitle: t(translations.aavePage.tx.borrowSubtitle, {
          symbol: nativeAsset.symbol,
          amount: ethers.utils.formatUnits(amount, nativeAsset.decimals),
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [this.PoolAddress, amount.toString(), rateMode, 0],
          contract: this.WETHGateway,
          fnName: 'borrowETH',
        },
        onComplete: opts?.onComplete,
      },
    ];
  }
}
