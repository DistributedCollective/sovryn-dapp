import { FC, useEffect, useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useAssetBalance } from '../../../../../../../../hooks/useAssetBalance';
import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { useQueryRate } from '../../../../../../../../hooks/useQueryRate';
import { getRskChainId } from '../../../../../../../../utils/chain';

type MyntAggregatorContractLiquidityProps = {
  pool: SupportedTokens;
  onChange: (asset: SupportedTokens, balance: Decimal) => void;
};

export const MyntAggregatorContractLiquidity: FC<
  MyntAggregatorContractLiquidityProps
> = ({ pool, onChange }) => {
  const myntMassetManager = useLoadContract('massetManager', 'protocol');

  const [rate] = useQueryRate(pool, SupportedTokens.rbtc);

  const { balance } = useAssetBalance(
    pool,
    getRskChainId(),
    myntMassetManager?.address.toLowerCase() || '',
  );

  const renderBalance = useMemo(() => balance.mul(rate), [balance, rate]);

  useEffect(() => {
    onChange(pool, renderBalance);
  }, [renderBalance, onChange, pool]);

  return null;
};
