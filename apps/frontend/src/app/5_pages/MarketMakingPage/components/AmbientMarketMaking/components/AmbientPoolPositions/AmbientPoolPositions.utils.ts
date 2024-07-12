import { MaxAllowanceTransferAmount } from '@uniswap/permit2-sdk';

import { BigNumber, Contract, ethers } from 'ethers';

import {
  baseTokenForConcLiq,
  bigNumToFloat,
  floatToBigNum,
  quoteTokenForConcLiq,
  tickToPrice,
} from '@sovryn/sdex';
import { CrocTokenView } from '@sovryn/sdex/dist/tokens';
import { Decimal } from '@sovryn/utils';

import { prepareApproveTransaction } from '../../../../../../../utils/transactions';
import { PoolPositionType } from '../../../../MarketMakingPage.types';
import {
  MAXIMUM_PRICE,
  MINIMUM_PRICE,
} from '../../../BobDepositModal/BobDepositModal.constants';
import { AmbientPosition } from '../../AmbientMarketMaking.types';

export const getPositionBalance = (
  position: AmbientPosition,
  spotPrice: number | undefined,
) => {
  if (!spotPrice) {
    return;
  }

  if (position.positionType === PoolPositionType.ambient) {
    const positionLiq = position.ambientLiq;
    const positionLiqBase = Number(
      Number(positionLiq) * Math.sqrt(spotPrice),
    ).toFixed(0);
    const positionLiqQuote = Number(
      Number(positionLiq) / Math.sqrt(spotPrice),
    ).toFixed(0);

    return {
      positionLiq,
      positionLiqBase: Number(positionLiqBase),
      positionLiqQuote: Number(positionLiqQuote),
    };
  } else if (position.positionType === PoolPositionType.concentrated) {
    const positionLiq = position.concLiq;
    const positionLiqBase = bigNumToFloat(
      baseTokenForConcLiq(
        spotPrice,
        floatToBigNum(Number(position.concLiq)),
        tickToPrice(position.bidTick),
        tickToPrice(position.askTick),
      ),
    );

    const positionLiqQuote = bigNumToFloat(
      quoteTokenForConcLiq(
        spotPrice,
        floatToBigNum(Number(position.concLiq)),
        tickToPrice(position.bidTick),
        tickToPrice(position.askTick),
      ),
    );

    return {
      positionLiq,
      positionLiqBase,
      positionLiqQuote,
    };
  }
};

export const calculateBoundedPrice = (
  isMinimumPrice: boolean,
  value: number,
  currentPrice: number,
) => {
  if (value === 0) {
    return currentPrice;
  }

  if (value === 100) {
    return isMinimumPrice ? MINIMUM_PRICE : MAXIMUM_PRICE;
  }

  const priceDifference = Decimal.from(currentPrice).mul(
    Decimal.from(value).div(100),
  );

  if (isMinimumPrice) {
    const result = Decimal.from(currentPrice).sub(priceDifference);
    return result.lt(0) ? 0 : result.toNumber();
  }

  return Decimal.from(currentPrice).add(priceDifference).toNumber();
};

export const adjustPriceByPercentage = (
  percentage: number,
  currentPrice: number,
): number => {
  const adjustmentFactor = 1 + percentage / 100;
  return currentPrice * adjustmentFactor;
};

export const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: BigNumber,
) => {
  const allowance = await token.allowance(owner);

  if (allowance.lt(amount)) {
    const approval = await token.approve();
    return approval;
  }
};

export const checkAndPrepareApproveTransaction = async ({
  account,
  token,
  assetAmount,
  chainId,
  signer,
}) => {
  const allowance = await testAllowance(account, token, assetAmount);

  if (allowance) {
    const approve = await prepareApproveTransaction({
      token: token.tokenAddr,
      chain: chainId,
      amount:
        allowance.weiQty === ethers.constants.MaxUint256
          ? MaxAllowanceTransferAmount
          : allowance.weiQty,
      spender: allowance.address,
      contract: new Contract(
        token.tokenAddr,
        (
          await token.context
        ).erc20Write.interface,
        signer,
      ),
    });

    return approve;
  }

  return null;
};
