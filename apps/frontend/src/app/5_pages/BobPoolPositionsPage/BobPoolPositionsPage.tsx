import React, { FC } from 'react';

import { prettyTx } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../hooks/useTokenDetailsByAsset';
import { decimalic } from '../../../utils/math';
import { AmbientLiquidityPoolDictionary } from '../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
import { useFetchPoolPositions } from './hooks/useFetchPoolPositions';

// TODO: Change to params, currently it's set to SOV/DLLR
// const BASE_TOKEN_ADDRESS = '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474';
// const QUOTE_TOKEN_ADDRESS = '0xf3107eEC1e6F067552C035FD87199e1A5169CB20';
const BASE_TOKEN_ADDRESS = '0x13411341d7c3140742B9aF45B8Db6d24f2428F3F';
const QUOTE_TOKEN_ADDRESS = '0x4Ad48819AB9f6601849dD4b73DF9b115C4AeFa3a';

const POOL = AmbientLiquidityPoolDictionary.list(BOB_CHAIN_ID).find(
  item =>
    item.baseAddress.toLowerCase() === BASE_TOKEN_ADDRESS.toLowerCase() &&
    item.quoteAddress.toLowerCase() === QUOTE_TOKEN_ADDRESS.toLowerCase(),
);

const BobPoolPositionsPage: FC = () => {
  const chainId = useCurrentChain();

  const baseToken = useTokenDetailsByAsset(POOL!.base, chainId);
  const quoteToken = useTokenDetailsByAsset(POOL!.quote, chainId);

  const positions = useFetchPoolPositions(POOL!);

  return (
    <div className="w-full">
      {positions?.map((item, index) => (
        <div className="w-full flex justify-between" key={item.positionId}>
          <div>Index: {index}</div>
          <div>Id: {prettyTx(item.positionId, 4, 4)}</div>
          <div>Min: {item.minPriceBase}</div>
          <div>Max: {item.maxPriceBase}</div>
          <div>
            {POOL?.base}:{' '}
            <AmountRenderer
              value={decimalic(item.positionLiqBase).toUnits(
                baseToken?.decimals,
              )}
            />
          </div>
          <div>
            {POOL?.quote}:{' '}
            <AmountRenderer
              value={decimalic(item.positionLiqQuote).toUnits(
                quoteToken?.decimals,
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BobPoolPositionsPage;
