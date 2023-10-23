import { useCallback } from 'react';

import { getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { MultiCallData } from '../types/multicall';
import { getRskChainId } from '../utils/chain';

export const useMulticall = () => {
  return useCallback(async (callData: MultiCallData[]) => {
    const contract = await getProtocolContract('multiCall', getRskChainId());
    const multiCall = contract.contract(getProvider(getRskChainId()));

    const data = callData.map(item => ({
      target: item.contract.address,
      callData: item.contract.interface.encodeFunctionData(
        item.fnName,
        item.args,
      ),
    }));

    const { returnData } = await multiCall.callStatic.aggregate(data);

    const result = callData.reduce((p, c, index) => {
      const value = c.contract.interface.decodeFunctionResult(
        c.fnName,
        returnData[index],
      );
      p[c.key || index] = c.parser ? c.parser(value) : value;
      return p;
    }, {} as Record<string, any>);

    return result;
  }, []);
};
