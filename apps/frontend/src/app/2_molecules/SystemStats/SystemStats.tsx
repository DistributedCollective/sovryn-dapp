import React, { FC } from 'react';

import { EcosystemStats } from './components/EcosystemStats';
import { ZeroStats } from './components/ZeroStats';

export const SystemStats: FC = () => (
  <>
    <ZeroStats className="mb-8" dataAttribute="zero-statistics" />
    <EcosystemStats dataAttribute="ecosystem-statistics" />
  </>
);
