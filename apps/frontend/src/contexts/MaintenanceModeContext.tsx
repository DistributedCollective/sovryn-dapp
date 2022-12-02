import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';

import axios from 'axios';

type Maintenance = {
  id: number;
  name: string;
  label: string;
  isInMaintenance: boolean;
};

type MaintenanceModeContextValue = {
  [id: string]: Maintenance;
};

const initialContext = {};

const MaintenanceModeContext =
  createContext<MaintenanceModeContextValue>(initialContext);

export const useMaintenanceModeContext = () =>
  useContext(MaintenanceModeContext);

export const MaintenanceModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  useEffect(() => {
    const fetchCall = () =>
      axios
        .get('https://maintenance-mode.test.sovryn.app/maintenance')
        .then(result => {
          console.log(`${JSON.stringify(result)}`);
        });

    const intervalId = setInterval(fetchCall, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <MaintenanceModeContext.Provider value={initialContext}>
      {children}
    </MaintenanceModeContext.Provider>
  );
};
