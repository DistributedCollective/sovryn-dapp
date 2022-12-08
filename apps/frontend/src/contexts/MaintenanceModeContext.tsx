import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import { MaintenanceStates } from '../types/maintenanceState';
import { getServicesConfig } from '../utils/helpers';

const initialContextValue = {};

const MaintenanceModeContext =
  createContext<MaintenanceStates>(initialContextValue);

export const useMaintenanceModeContext = () =>
  useContext(MaintenanceModeContext);

const servicesConfig = getServicesConfig();

export const MaintenanceModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [maintenanceStates, setMaintenanceStates] =
    useState<MaintenanceStates>(initialContextValue);

  useEffect(() => {
    const fetchCall = () =>
      axios
        .get(servicesConfig.maintenance)
        .then(result => setMaintenanceStates(parseStates(result)));

    const intervalId = setInterval(fetchCall, 60000);

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

const parseStates = fetchResult => {
  const result = {};
  fetchResult?.data.forEach(item => (result[item.name] = item));

  return result;
};
