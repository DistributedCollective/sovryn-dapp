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

export const getMaxDrawdown = async (
  loanToken: SupportedTokens,
  collateralToken: SupportedTokens,
  loanAmount: Decimal,
  collateralAmount: Decimal,
  margin: Decimal,
): Promise<Decimal> => {
  const contract = (
    await getProtocolContract('priceFeed', defaultChainId)
  ).contract(getProvider(defaultChainId));
  const loanAddress = (
    await getTokenDetails(normalizeTokenWrapped(loanToken), defaultChainId)
  ).address;
  const collateralAddress = (
    await getTokenDetails(
      normalizeTokenWrapped(collateralToken),
      defaultChainId,
    )
  ).address;
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
  const contract = (
    await getLoanTokenContract(loanToken, defaultChainId)
  ).contract(getProvider(defaultChainId));

  const collateralTokenAddress = (
    await getTokenDetails(collateralToken, defaultChainId)
  ).address;

  const amount = await contract.getBorrowAmountForDeposit(
    collateralAmount.toHexString(),
    durationInSeconds,
    collateralTokenAddress,
  );

  return Decimal.fromBigNumberString(amount);
};
