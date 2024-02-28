import {
  SupportedTokens,
  getLoanTokenContract,
  getProtocolContract,
  getTokenDetails,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { rskChainId } from '../../../../../config/chains';

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
    getProtocolContract('priceFeed', rskChainId).then(({ contract }) =>
      contract(getProvider(rskChainId)),
    ),
    getTokenDetails(normalizeTokenWrapped(loanToken), rskChainId).then(
      ({ address }) => address,
    ),
    getTokenDetails(normalizeTokenWrapped(collateralToken), rskChainId).then(
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
  loanToken: SupportedTokens,
  collateralAmount: Decimal,
  collateralToken: SupportedTokens,
  durationInSeconds: number,
): Promise<Decimal> => {
  const [contract, collateralTokenAddress] = await Promise.all([
    getLoanTokenContract(loanToken, rskChainId).then(({ contract }) =>
      contract(getProvider(rskChainId)),
    ),
    getTokenDetails(collateralToken, rskChainId).then(({ address }) => address),
  ]);

  const amount = await contract.getBorrowAmountForDeposit(
    collateralAmount.toHexString(),
    durationInSeconds,
    collateralTokenAddress,
  );

  return Decimal.fromBigNumberString(amount);
};
