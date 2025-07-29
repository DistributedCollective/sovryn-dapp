import { useState } from 'react';

import { BridgeService } from '@sovryn/sdk';

export const useBridgeService = () => {
  const [service] = useState(() => new BridgeService());

  return service;
};
