import {
  SupportedTokens,
  getLoanTokenContract,
  getProtocolContract,
  getTokenDetails,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../config/chains';

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
  loanToken: SupportedTokens,
  collateralToken: SupportedTokens,
  loanAmount: Decimal,
  collateralAmount: Decimal,
  margin: Decimal,
): Promise<Decimal> => {
  const [contract, loanAddress, collateralAddress] = await Promise.all([
    getProtocolContract('priceFeed', defaultChainId).then(({ contract }) =>
      contract(getProvider(defaultChainId)),
    ),
    getTokenDetails(normalizeTokenWrapped(loanToken), defaultChainId).then(
      ({ address }) => address,
    ),
    getTokenDetails(
      normalizeTokenWrapped(collateralToken),
      defaultChainId,
    ).then(({ address }) => address),
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
  loanToken: SupportedTokens,
  collateralAmount: Decimal,
  collateralToken: SupportedTokens,
  durationInSeconds: number,
): Promise<Decimal> => {
  const [contract, collateralTokenAddress] = await Promise.all([
    getLoanTokenContract(loanToken, defaultChainId).then(({ contract }) =>
      contract(getProvider(defaultChainId)),
    ),
    getTokenDetails(collateralToken, defaultChainId).then(
      ({ address }) => address,
    ),
  ]);

  const amount = await contract.getBorrowAmountForDeposit(
    collateralAmount.toHexString(),
    durationInSeconds,
    collateralTokenAddress,
  );

  return Decimal.fromBigNumberString(amount);
};
