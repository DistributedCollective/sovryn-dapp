import React, { FC } from 'react';

import bobLogo from '../../../../../../../../../../../assets/chains/bob-light.svg';

export const Spice: FC = () => (
  <div className="flex items-center ml-2">
    <img src={bobLogo} alt="BOB" className="w-3.5" />
    <div className="ml-1.5">Spice</div>
  </div>
);
