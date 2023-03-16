import { useEffect, useMemo } from 'react';

import { _getContracts } from '@sovryn-zero/lib-ethers/dist/src/EthersLiquityConnection';

import { getZeroProvider } from '../../../5_pages/ZeroPage/utils/zero-provider';
import { useCall } from '../../../../hooks/useCall';
import { toWei, ZERO } from '../../../../utils/math';
import { CRITICAL_COLLATERAL_RATIO } from '../constants';
import { BigNumber } from 'ethers';

type ZeroData = {
  tcr: BigNumber;
  liquidationReserve: BigNumber;
};

type ZeroDataResponse = ZeroData & {
  isRecoveryMode: boolean;
};

export const useZeroData = (rbtcPrice?: BigNumber): ZeroDataResponse => {
  const [response, getTcr] = useCall<ZeroData>(
    async () => {
      const { ethers } = await getZeroProvider();
      const price = rbtcPrice
        ? rbtcPrice
        : await ethers.getPrice().then(value => value.bigNumber);

      const contract = _getContracts(ethers.connection).troveManager;
      const liquidationReserve = await contract.ZUSD_GAS_COMPENSATION();
      const tcr = await contract.getTCR(price);
      return {
        tcr,
        liquidationReserve,
      };
    },
    [rbtcPrice],
    { tcr: ZERO, liquidationReserve: ZERO },
  );

  useEffect(() => {
    getTcr().catch(console.error);
  }, [getTcr]);

  return useMemo(
    () => ({
      ...response,
      isRecoveryMode: response.tcr.lte(toWei(CRITICAL_COLLATERAL_RATIO)),
    }),
    [response],
  );
};
