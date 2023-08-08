import { useCallback } from 'react';

import { MultiCallData } from '../types/multicall';
import { getRskChainId } from '../utils/chain';
import { useLoadContract } from './useLoadContract';

export const useMulticall = () => {
  const multiCall = useLoadContract('multiCall', 'protocol', getRskChainId());

  return useCallback(
    async (callData: MultiCallData[]) => {
      if (!multiCall) {
        return [];
      }

      const data = callData.map(item => ({
        target: item.contract.address,
        callData: item.contract.interface.encodeFunctionData(
          item.fnName,
          item.args,
        ),
      }));

      const { returnData } = await multiCall.callStatic.aggregate(data);

      const result = callData.map((item, index) => {
        const value = item.contract.interface.decodeFunctionResult(
          item.fnName,
          returnData[index],
        );
        return item.parser ? item.parser(value) : value;
      });

      return result;
    },
    [multiCall],
  );
};
