import React, { FC } from 'react';

import { Heading, HeadingType } from '@sovryn/ui';

import { SovrynLogo } from '../../2_molecules';
import { DebugContent } from '../../2_molecules/DebugContent';
import { PageContainer } from '../../4_templates';

const App: FC = () => (
  <>
    <PageContainer contentClassName="flex flex-col">
      <div className="flex flex-col flex-grow justify-center">
        <div className="flex justify-center items-center">
          <SovrynLogo dataAttribute="construction-logo" className="w-96" />
        </div>
        <Heading type={HeadingType.h1} className="text-center mt-2">
          Sovryn Dapp is currently under construction.
        </Heading>
      </div>
      <div className="w-full justify-self-end">
        <DebugContent />
      </div>
    </PageContainer>
  </>
);

export default App;
