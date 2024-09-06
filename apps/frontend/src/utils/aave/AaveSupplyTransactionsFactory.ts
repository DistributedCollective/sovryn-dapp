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
import { TransactionFactoryOptions } from '../../types/aave';
import { prepareApproveTransaction } from '../transactions';

export class AaveSupplyTransactionsFactory {
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
        'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
        'function setUserUseReserveAsCollateral(address asset, bool useAsCollateral)',
      ],
      this.signer,
    );

    this.WETHGateway = new ethers.Contract(
      this.WETHGatewayAddress,
      [
        'function depositETH(address pool, address onBehalfOf, uint16 referralCode) payable',
      ],
      this.signer,
    );
  }

  async supply(
    token: AssetDetailsData,
    amount: BigNumber,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    if (
      token.isNative ||
      token.address.toLowerCase() === config.WETHAddress.toLowerCase()
    ) {
      return this.supplyNative(amount, opts);
    } else return this.supplyToken(token, amount, opts);
  }

  async collateralSwitch(
    token: AssetDetailsData,
    useAsCollateral: boolean,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    const tokenAddress = token.isNative ? config.WETHAddress : token.address;

    return [
      {
        title: useAsCollateral
          ? t(translations.aavePage.tx.enableAssetAsCollateral, {
              symbol: token.symbol,
            })
          : t(translations.aavePage.tx.disableAssetAsCollateral, {
              symbol: token.symbol,
            }),
        subtitle: useAsCollateral
          ? t(translations.aavePage.tx.enableAssetAsCollateralSubtitle, {
              symbol: token.symbol,
            })
          : t(translations.aavePage.tx.disableAssetAsCollateralSubtitle, {
              symbol: token.symbol,
            }),
        request: {
          type: TransactionType.signTransaction,
          args: [tokenAddress, useAsCollateral],
          contract: this.Pool,
          fnName: 'setUserUseReserveAsCollateral',
        },
        onComplete: opts?.onComplete,
      },
    ];
  }

  private async supplyToken(
    asset: AssetDetailsData,
    amount: BigNumber,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    const approval = await prepareApproveTransaction({
      spender: this.PoolAddress,
      token: asset.symbol,
      contract: new Contract(asset.address, asset.abi, this.signer),
      amount: amount,
      chain: BOB_CHAIN_ID,
    });
    const transactions: Transaction[] = approval ? [approval] : [];

    transactions.push({
      title: t(translations.aavePage.tx.supplyTitle, {
        symbol: asset.symbol,
      }),
      subtitle: t(translations.aavePage.tx.supplySubtitle, {
        symbol: asset.symbol,
        amount: ethers.utils.formatUnits(amount, asset.decimals),
      }),
      request: {
        type: TransactionType.signTransaction,
        args: [
          asset.address,
          amount.toString(),
          await this.signer.getAddress(),
          0,
        ],
        contract: this.Pool,
        fnName: 'supply',
        value: 0,
      },
      onComplete: opts?.onComplete,
    });

    return transactions;
  }

  private async supplyNative(
    amount: BigNumber,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    const nativeAsset = await getAssetDataByAddress(
      constants.AddressZero,
      BOB_CHAIN_ID,
    );

    return [
      {
        title: t(translations.aavePage.tx.supplyTitle, {
          symbol: nativeAsset.symbol,
        }),
        subtitle: t(translations.aavePage.tx.supplySubtitle, {
          symbol: nativeAsset.symbol,
          amount: ethers.utils.formatUnits(amount, nativeAsset.decimals),
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [this.PoolAddress, await this.signer.getAddress(), 0],
          contract: this.WETHGateway,
          fnName: 'depositETH',
          value: amount.toString(),
        },
        onComplete: opts?.onComplete,
      },
    ];
  }
}
