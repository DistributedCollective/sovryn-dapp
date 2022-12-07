import React, { FC } from 'react';

import { Outlet } from 'react-router-dom';

export const MainLayout: FC = () => (
  <>
    <main>
      <Outlet />
    </main>
  </>
);
