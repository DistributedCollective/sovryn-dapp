import React from 'react';

import { SendFlowContext } from '../contexts/sendflow';

export const useSendFlowService = () => {
  const { set, step, selectedToken, amount, address, limits } =
    React.useContext(SendFlowContext);
  return {
    set,
    step,
    selectedToken,
    amount,
    address,
    limits,
  };
};
