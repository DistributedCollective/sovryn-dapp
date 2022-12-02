import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

type Maintenance = {
  id: number;
  name: string;
  label: string;
  isInMaintenance: boolean;
};

export type MaintenanceModeContextValue = {
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
  const [maintenanceStates, setMaintenanceStates] =
    useState<MaintenanceModeContextValue>(initialContext);

  useEffect(() => {
    const fetchCall = () =>
      axios
        .get('https://maintenance-mode.test.sovryn.app/maintenance')
        .then(result => setMaintenanceStates(parseResult(result)));

    const intervalId = setInterval(fetchCall, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [maintenanceStates]);

  return (
    <MaintenanceModeContext.Provider value={maintenanceStates}>
      {children}
    </MaintenanceModeContext.Provider>
  );
};

const parseResult = (fetchResult: any) => {
  const result = {};
  fetchResult?.data.forEach(item => (result[item.name] = item));

  return result;
};
