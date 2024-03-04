import { FC, useEffect, useMemo, useState } from 'react';

import { SupportedTokens, getTokenDetails } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../../../../../config/chains';

import { LendingPool } from '../../../../../../../../../../utils/LendingPool';
import { removeTrailingZerosFromString } from '../../../../../../../../../../utils/helpers';
import {
  decimalic,
  fromWei,
  toWei,
} from '../../../../../../../../../../utils/math';
import { SMART_ROUTER_RSK } from '../../../../../../../../ConvertPage/ConvertPage.constants';
import { useGetAssetBalanceOf } from '../../../../../../../../LendPage/components/LendFrame/components/LendFrameBalance/hooks/useGetAssetBalanceOf';

type LendingPoolBalanceProps = {
  pool: LendingPool;
  onBalanceChange: (balanceToAdd: Decimal) => void;
  block: number;
};

export const LendingPoolBalance: FC<LendingPoolBalanceProps> = ({
  pool,
  onBalanceChange,
  block,
}) => {
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { assetBalance } = useGetAssetBalanceOf(asset);
  const [balance, setBalance] = useState(Decimal.ZERO);
  const isNativeAsset = useMemo(() => asset === SupportedTokens.rbtc, [asset]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!assetBalance || decimalic(assetBalance).isZero()) {
        setBalance(Decimal.ZERO);
        return;
      }

      if (isNativeAsset) {
        setBalance(decimalic(assetBalance));
      } else {
        const [sourceTokenDetails, destinationTokenDetails] = await Promise.all(
          [
            getTokenDetails(asset, RSK_CHAIN_ID),
            getTokenDetails(SupportedTokens.rbtc, RSK_CHAIN_ID),
          ],
        );

        const result = await SMART_ROUTER_RSK.getBestQuote(
          RSK_CHAIN_ID,
          sourceTokenDetails.address,
          destinationTokenDetails.address,
          toWei(assetBalance),
        );
        const quote = removeTrailingZerosFromString(
          fromWei(result.quote.toString()),
        );
        setBalance(decimalic(quote));
      }
    };

    fetchBalance();
  }, [assetBalance, onBalanceChange, block, isNativeAsset, asset]);

  useEffect(() => {
    onBalanceChange(balance);
  }, [balance, onBalanceChange, block]);

  return null;
};
