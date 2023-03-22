import { useEffect, useMemo } from 'react';

import { _getContracts } from '@sovryn-zero/lib-ethers/dist/src/EthersLiquityConnection';
import { Decimal } from '@sovryn/utils';

import { getZeroProvider } from '../../../5_pages/ZeroPage/utils/zero-provider';
import { useCall } from '../../../../hooks/useCall';
import { CRITICAL_COLLATERAL_RATIO } from '../constants';

type ZeroData = {
  tcr: Decimal;
  liquidationReserve: Decimal;
};

type ZeroDataResponse = ZeroData & {
  isRecoveryMode: boolean;
};

export const useZeroData = (rbtcPrice?: Decimal): ZeroDataResponse => {
  const [response, getTcr] = useCall<ZeroData>(
    async () => {
      const { ethers } = await getZeroProvider();
      const price = rbtcPrice
        ? rbtcPrice
        : await ethers.getPrice().then(String).then(Decimal.from);

      const contract = _getContracts(ethers.connection).troveManager;
      const liquidationReserve = await contract
        .ZUSD_GAS_COMPENSATION()
        .then(String)
        .then(Decimal.fromBigNumberString);
      const tcr = await contract
        .getTCR(price.toBigNumber())
        .then(String)
        .then(Decimal.fromBigNumberString);
      return {
        tcr,
        liquidationReserve,
      };
    },
    [rbtcPrice],
    { tcr: Decimal.ZERO, liquidationReserve: Decimal.ZERO },
  );

  useEffect(() => {
    getTcr().catch(console.error);
  }, [getTcr]);

  return useMemo(
    () => ({
      ...response,
      isRecoveryMode: response.tcr.lte(CRITICAL_COLLATERAL_RATIO),
    }),
    [response],
  );
};
