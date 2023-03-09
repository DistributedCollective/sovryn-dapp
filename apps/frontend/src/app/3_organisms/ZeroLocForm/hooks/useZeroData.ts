import { useEffect, useMemo } from 'react';

import { _getContracts } from '@sovryn-zero/lib-ethers/dist/src/EthersLiquityConnection';

import { getZeroProvider } from '../../../5_pages/ZeroPage/utils/zero-provider';
import { useCall } from '../../../../hooks/useCall';
import { fromWei, toWei } from '../../../../utils/math';
import { CRITICAL_COLLATERAL_RATIO } from '../constants';

type ZeroData = {
  tcr: number;
  liquidationReserve: number;
};

type ZeroDataResponse = ZeroData & {
  isRecoveryMode: boolean;
};

export const useZeroData = (rbtcPrice?: number): ZeroDataResponse => {
  const [response, getTcr] = useCall<ZeroData>(
    async () => {
      const { ethers } = await getZeroProvider();
      const price = toWei(
        rbtcPrice
          ? rbtcPrice.toString()
          : await ethers.getPrice().then(value => value.toString()),
      );

      const contract = _getContracts(ethers.connection).troveManager;
      const liquidationReserve = await contract
        .ZUSD_GAS_COMPENSATION()
        .then(fromWei)
        .then(Number);
      const tcr = await contract.getTCR(price).then(fromWei).then(Number);
      return {
        tcr,
        liquidationReserve,
      };
    },
    [rbtcPrice],
    { tcr: 0, liquidationReserve: 0 },
  );

  useEffect(() => {
    getTcr().catch(console.error);
  }, [getTcr]);

  return useMemo(
    () => ({
      ...response,
      isRecoveryMode: response.tcr <= CRITICAL_COLLATERAL_RATIO,
    }),
    [response],
  );
};
