import React, { FC } from 'react';

import { ZeroLocForm } from '../../3_organisms/ZeroLocForm/ZeroLocForm';

export const ZeroPage: FC = () => {
  return (
    <div className="container max-w-7xl mt-24">
      <div className="w-full flex flex-row justify-start items-start gap-6">
        <div className="flex-shrink-0 flex-grow-0">
          <ZeroLocForm />
        </div>
        <div className="flex-grow">Line of credit history / TBD</div>
      </div>
    </div>
  );
};
