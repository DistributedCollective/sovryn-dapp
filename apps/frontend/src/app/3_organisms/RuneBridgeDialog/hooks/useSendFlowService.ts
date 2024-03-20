import React from 'react';

import { SendFlowContext } from '../contexts/sendflow';

export const useSendFlowService = () => {
  const { set, step } = React.useContext(SendFlowContext);
  return {
    set,
    step,
  };
};
