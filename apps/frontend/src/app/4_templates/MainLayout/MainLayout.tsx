import React, { FC } from 'react';

import { Outlet } from 'react-router-dom';
import { Header } from '../../3_organisms/Header/Header';

export const MainLayout: FC = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);
