import { useState } from 'react';

import { BridgeService } from '@sovryn/sdk';

import { isMainnet } from '../../../../utils/helpers';

export const useBridgeService = () => {
  const [service] = useState(() => new BridgeService(!isMainnet()));

  return service;
};
