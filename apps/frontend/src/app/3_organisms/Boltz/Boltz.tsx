import React, { FC } from 'react';

import { BoltzReceive } from './components/BoltzReceive/BoltzReceive';
import { BoltzSend } from './components/BoltzSend/BoltzSend';

export const Boltz: FC = () => {
  return (
    <div>
      <BoltzSend />
      <BoltzReceive />
    </div>
  );
};
