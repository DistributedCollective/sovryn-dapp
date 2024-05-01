import {
  getAssetData,
  getLoanTokenContract,
  getProtocolContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { normalizeTokenWrapped } from '../../BorrowPage.utils';

export const calculateDebtRepaidPercentage = (
  totalDebt: string,
  debtRepaid: Decimal,
) => Decimal.from(debtRepaid).div(totalDebt);

export const calculateRepayCollateralWithdrawn = (
  totalDebt: string,
  debtRepaid: Decimal,
  totalCollateral: string,
) =>
  Decimal.from(totalCollateral).mul(
    calculateDebtRepaidPercentage(totalDebt, debtRepaid),
  );

export const getMaxDrawdown = async (
  loanToken: string,
  collateralToken: string,
  loanAmount: Decimal,
  collateralAmount: Decimal,
  margin: Decimal,
): Promise<Decimal> => {
  const [contract, loanAddress, collateralAddress] = await Promise.all([
    getProtocolContract('priceFeed', RSK_CHAIN_ID).then(({ contract }) =>
      contract(getProvider(RSK_CHAIN_ID)),
    ),
    getAssetData(normalizeTokenWrapped(loanToken), RSK_CHAIN_ID).then(
      ({ address }) => address,
    ),
    getAssetData(normalizeTokenWrapped(collateralToken), RSK_CHAIN_ID).then(
      ({ address }) => address,
    ),
  ]);

  const amount = await contract.getMaxDrawdown(
    loanAddress,
    collateralAddress,
    loanAmount.toHexString(),
    collateralAmount.toHexString(),
    margin.toHexString(),
  );
  return Decimal.fromBigNumberString(amount);
};

export const getBorrowAmount = async (
  loanToken: string,
  collateralAmount: Decimal,
  collateralToken: string,
  durationInSeconds: number,
): Promise<Decimal> => {
  const [contract, collateralTokenAddress] = await Promise.all([
    getLoanTokenContract(loanToken, RSK_CHAIN_ID).then(({ contract }) =>
      contract(getProvider(RSK_CHAIN_ID)),
    ),
    getAssetData(collateralToken, RSK_CHAIN_ID).then(({ address }) => address),
  ]);

  const amount = await contract.getBorrowAmountForDeposit(
    collateralAmount.toHexString(),
    durationInSeconds,
    collateralTokenAddress,
  );

  return Decimal.fromBigNumberString(amount);
};
