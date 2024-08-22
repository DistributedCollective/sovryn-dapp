import { BigNumber, Contract, ethers } from 'ethers';
import { t } from 'i18next';

import { AssetDetailsData, getAssetData } from '@sovryn/contracts';

import { BOB_CHAIN_ID } from '../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { translations } from '../../locales/i18n';
import { prepareApproveTransaction } from '../transactions';

export class AaveWithdrawTransactionsFactory {
  private readonly Pool: ethers.Contract;
  private readonly WETHGateway: ethers.Contract;

  constructor(
    private readonly PoolAddress: string,
    private readonly WETHGatewayAddress: string,
    private readonly signer: ethers.Signer,
  ) {
    this.Pool = new ethers.Contract(
      this.PoolAddress,
      ['function withdraw(address asset, uint256 amount, address to)'],
      this.signer,
    );

    this.WETHGateway = new ethers.Contract(
      this.WETHGatewayAddress,
      ['function withdrawETH(address pool, uint256 amount, address to)'],
      this.signer,
    );
  }

  async withdraw(
    token: AssetDetailsData,
    amount: BigNumber,
  ): Promise<Transaction[]> {
    if (token.isNative) return this.withdrawNative(amount);
    else return this.withdrawToken(token, amount);
  }

  private async withdrawToken(
    asset: AssetDetailsData,
    amount: BigNumber,
  ): Promise<Transaction[]> {
    return [
      {
        title: t(translations.aavePage.tx.withdrawTitle, {
          symbol: asset.symbol,
        }),
        subtitle: t(translations.aavePage.tx.withdrawSubtitle, {
          symbol: asset.symbol,
          amount: ethers.utils.formatUnits(amount, asset.decimals),
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [
            asset.address,
            amount.toString(),
            await this.signer.getAddress(),
          ],
          contract: this.Pool,
          fnName: 'withdraw',
        },
      },
    ];
  }

  private async withdrawNative(amount: BigNumber): Promise<Transaction[]> {
    const aWETH = await getAssetData('aWETH', BOB_CHAIN_ID);

    const approval = await prepareApproveTransaction({
      spender: this.WETHGatewayAddress,
      token: aWETH.symbol,
      contract: new Contract(aWETH.address, aWETH.abi, this.signer),
      amount: amount,
      chain: BOB_CHAIN_ID,
    });
    const transactions: Transaction[] = approval ? [approval] : [];

    transactions.push({
      title: t(translations.aavePage.tx.withdrawTitle, {
        symbol: aWETH.symbol,
      }),
      subtitle: t(translations.aavePage.tx.withdrawSubtitle, {
        symbol: aWETH.symbol,
        amount: ethers.utils.formatUnits(amount, aWETH.decimals),
      }),
      request: {
        type: TransactionType.signTransaction,
        args: [
          this.PoolAddress,
          amount.toString(),
          await this.signer.getAddress(),
        ],
        contract: this.WETHGateway,
        fnName: 'withdrawETH',
      },
    });

    return transactions;
  }
}
