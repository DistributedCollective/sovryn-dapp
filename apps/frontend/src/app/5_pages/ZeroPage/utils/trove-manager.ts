import {
  Decimal,
  Decimalish,
  Trove,
  TroveAdjustmentParams,
  TroveCreationParams,
  _normalizeTroveAdjustment,
  _normalizeTroveCreation,
} from '@sovryn-zero/lib-base';

import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { t } from 'i18next';

import {
  getProtocolContract,
  getTokenDetails,
  SupportedTokens,
} from '@sovryn/contracts';

import { defaultChainId } from '../../../../config/chains';

import { translations } from '../../../../locales/i18n';
import { GAS_LIMIT_ADJUST_TROVE } from '../../../../utils/constants';
import { getZeroProvider } from './zero-provider';

const defaultBorrowingRateSlippageTolerance = 0.005; // 0.5%

export const openTrove = async (
  token: SupportedTokens,
  params: Partial<TroveCreationParams<Decimalish>>,
) => {
  const normalized = _normalizeTroveCreation(params);
  const { depositCollateral, borrowZUSD } = normalized;

  const { ethers } = await getZeroProvider();

  const fees = await ethers.getFees();
  const borrowingRate = fees.borrowingRate();
  const newTrove = Trove.create(normalized, borrowingRate);

  const maxBorrowingRate = borrowingRate.add(
    defaultBorrowingRateSlippageTolerance,
  );

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(newTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'openNueTrove' : 'openTrove',
    args: [maxBorrowingRate.hex, borrowZUSD.hex, ...hints],
  };
};

export const adjustTrove = async (
  address: string,
  params: Partial<TroveAdjustmentParams<Decimalish>>,
) => {
  const normalized = _normalizeTroveAdjustment(params);
  const { depositCollateral, withdrawCollateral, borrowZUSD, repayZUSD } =
    normalized;

  const { ethers } = await getZeroProvider();

  const [trove, fees] = await Promise.all([
    ethers.getTrove(address),
    borrowZUSD && ethers.getFees(),
  ]);

  const borrowingRate = fees?.borrowingRate();
  const finalTrove = trove.adjust(normalized, borrowingRate);

  const maxBorrowingRate =
    borrowingRate?.add(defaultBorrowingRateSlippageTolerance) ?? Decimal.ZERO;

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(finalTrove);

  return {
    value: value.hex,
    fn: 'adjustTrove',
    args: [
      maxBorrowingRate.hex,
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowZUSD ?? repayZUSD ?? Decimal.ZERO).hex,
      !!borrowZUSD,
      ...hints,
    ],
  };
};

// Temp type. Will be removed when permit is implemented
type Tx = {
  title: string;
  value: string;
  fn: string;
  args: any[];
  contract?: Contract;
  gas?: number;
};

const getMassetManager = async (signer: Signer) => {
  const { address: massetManagerAddress, abi: massetManagerAbi } =
    await getProtocolContract('massetManager', defaultChainId);
  return new ethers.Contract(massetManagerAddress, massetManagerAbi, signer);
};

// Just a workaround to make adjusting DLLR trove until permit is implemented
export const adjustNueTrove = async (
  address: string,
  params: Partial<TroveAdjustmentParams<Decimalish>>,
  signer: Signer,
) => {
  const transactions: Tx[] = [];
  const normalized = _normalizeTroveAdjustment(params);

  // convert DLLR to ZUSD and then repay ZUSD
  if (normalized.repayZUSD) {
    const massetManager = await getMassetManager(signer);

    const { address: bassetAddress } = await getTokenDetails(
      SupportedTokens.zusd,
      defaultChainId,
    );

    transactions.push({
      title: t(translations.convertPage.txDialog.convert, {
        asset: SupportedTokens.dllr.toUpperCase(),
      }),
      contract: massetManager,
      fn: 'redeemTo',
      args: [bassetAddress, normalized.repayZUSD.bigNumber, address],
      value: '0',
    });

    const repayTx = await adjustTrove(address, params);
    transactions.push({
      ...repayTx,
      title: t(translations.zeroPage.tx.repay, {
        asset: SupportedTokens.zusd.toUpperCase(),
      }),
      gas: GAS_LIMIT_ADJUST_TROVE,
    });
    return transactions;
  }

  // borrow ZUSD and then convert ZUSD to DLLR
  if (normalized.borrowZUSD) {
    const borrowTx = await adjustTrove(address, params);
    transactions.push({
      ...borrowTx,
      title: t(translations.zeroPage.tx.borrow, {
        asset: SupportedTokens.zusd.toUpperCase(),
      }),
      gas: GAS_LIMIT_ADJUST_TROVE,
    });

    // approve ZUSD to be converted to DLLR
    const massetManager = await getMassetManager(signer);

    const { address: bassetAddress, abi: bassetAbi } = await getTokenDetails(
      SupportedTokens.zusd,
      defaultChainId,
    );

    const bassetToken = new ethers.Contract(bassetAddress, bassetAbi, signer);

    const allowance = await bassetToken.allowance(
      address,
      massetManager.address,
    );

    if (BigNumber.from(allowance).lt(normalized.borrowZUSD.bigNumber)) {
      transactions.push({
        title: t(translations.convertPage.txDialog.approve, {
          asset: bassetToken.toUpperCase(),
        }),
        contract: bassetToken,
        fn: 'approve',
        args: [massetManager.address, normalized.borrowZUSD.bigNumber],
        value: '0',
      });
    }

    // convert ZUSD to DLLR
    transactions.push({
      title: t(translations.convertPage.txDialog.convert, {
        asset: SupportedTokens.zusd.toUpperCase(),
      }),
      contract: massetManager,
      fn: 'mintTo',
      args: [bassetAddress, normalized.borrowZUSD.bigNumber, address],
      value: '0',
      gas: 150000,
    });

    return transactions;
  }

  // user only adjusts collateral
  if (normalized.withdrawCollateral || normalized.depositCollateral) {
    const tx = await adjustTrove(address, params);
    return [
      {
        ...tx,
        gas: GAS_LIMIT_ADJUST_TROVE,
        title: normalized.depositCollateral
          ? t(translations.zeroPage.tx.addCollateral)
          : t(translations.zeroPage.tx.withdrawCollateral),
      },
    ];
  }

  return [];
};
