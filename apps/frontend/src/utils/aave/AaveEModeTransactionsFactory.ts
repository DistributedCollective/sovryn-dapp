import { ethers } from 'ethers';
import { t } from 'i18next';

import {
  Transaction,
  TransactionType,
} from '../../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { translations } from '../../locales/i18n';
import { EModeCategory, TransactionFactoryOptions } from '../../types/aave';

export class AaveEModeTransactionsFactory {
  private readonly Pool: ethers.Contract;

  constructor(
    private readonly PoolAddress: string,
    private readonly signer: ethers.Signer,
  ) {
    this.Pool = new ethers.Contract(
      this.PoolAddress,
      ['function setUserEMode(uint8 categoryId)'],
      this.signer,
    );
  }

  async setUserEMode(
    category: EModeCategory,
    opts?: TransactionFactoryOptions,
  ): Promise<Transaction[]> {
    return [
      {
        title: t(translations.aavePage.tx.setUserEModeTitle, {
          category: category.label,
        }),
        subtitle: t(translations.aavePage.tx.setUserEModeSubtitle, {
          category: category.label,
        }),
        request: {
          type: TransactionType.signTransaction,
          args: [category.id],
          contract: this.Pool,
          fnName: 'setUserEMode',
        },
        onComplete: opts?.onComplete,
      },
    ];
  }

  async disableEMode(opts?: TransactionFactoryOptions): Promise<Transaction[]> {
    return [
      {
        title: t(translations.aavePage.tx.disableEModeTitle),
        subtitle: t(translations.aavePage.tx.disableEModeSubtitle),
        request: {
          type: TransactionType.signTransaction,
          args: [0],
          contract: this.Pool,
          fnName: 'setUserEMode',
        },
        onComplete: opts?.onComplete,
      },
    ];
  }
}
