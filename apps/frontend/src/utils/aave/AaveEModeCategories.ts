import { ethers } from 'ethers';

import { Decimal } from '@sovryn/utils';

import { Reserve } from '../../hooks/aave/useAaveReservesData';
import { EModeCategory } from '../../types/aave';

export class AaveEModeCategories {
  private readonly Pool: ethers.Contract;

  constructor(
    private readonly PoolAddress: string,
    private readonly provider: ethers.providers.Provider,
  ) {
    this.Pool = new ethers.Contract(
      this.PoolAddress,
      [
        {
          inputs: [
            {
              internalType: 'uint8',
              name: 'id',
              type: 'uint8',
            },
          ],
          name: 'getEModeCategoryData',
          outputs: [
            {
              components: [
                {
                  internalType: 'uint16',
                  name: 'ltv',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'liquidationThreshold',
                  type: 'uint16',
                },
                {
                  internalType: 'uint16',
                  name: 'liquidationBonus',
                  type: 'uint16',
                },
                {
                  internalType: 'address',
                  name: 'priceSource',
                  type: 'address',
                },
                {
                  internalType: 'string',
                  name: 'label',
                  type: 'string',
                },
              ],
              internalType: 'struct DataTypes.EModeCategory',
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      this.provider,
    );
  }

  getAllEModeCategories(reserves: Reserve[]): Promise<EModeCategory[]> {
    const categoriesIds = Array.from(
      new Set(reserves.map(r => r.eModeCategoryId)),
    ).filter(c => c !== 0);

    return Promise.allSettled(
      categoriesIds.map(categoryId =>
        this.getEModeCategory(categoryId, reserves),
      ),
    ).then(res =>
      res
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<EModeCategory>).value),
    );
  }

  async getEModeCategory(
    categoryId: number,
    reserves: Reserve[],
  ): Promise<EModeCategory> {
    const [ltv, liquidationThreshold, liquidationBonus, , label] =
      await this.Pool.getEModeCategoryData(categoryId);

    const assets = reserves
      .filter(r => r.eModeCategoryId === categoryId)
      .map(r => r.symbol);

    return {
      id: categoryId,
      ltv: Decimal.from(ltv),
      liquidationThreshold: Decimal.from(liquidationThreshold),
      liquidationBonus: Decimal.from(liquidationBonus),
      label,
      assets,
    };
  }
}
