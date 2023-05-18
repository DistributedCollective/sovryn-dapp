import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  const timeoutId = useRef<NodeJS.Timeout>();
  const [fetched, setFetched] = useState(false);
  const [maintenanceStates, setMaintenanceStates] =
    useState<MaintenanceStates>(initialContextValue);

  const fetchMaintenanceStates = useCallback(
    () =>
      axios
        .get(servicesConfig.maintenance)
        .then(result => setMaintenanceStates(parseStates(result)))
        .finally(() => {
          setFetched(true);
          if (timeoutId.current) {
            clearTimeout(timeoutId.current);
          }
          timeoutId.current = setTimeout(fetchMaintenanceStates, 25e3);
        }),
    [],
  );

  useEffect(() => {
    fetchMaintenanceStates();
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [fetchMaintenanceStates]);

  return (
    <MaintenanceModeContext.Provider value={maintenanceStates}>
      {fetched ? children : <></>}
    </MaintenanceModeContext.Provider>
  );
};

const parseStates = fetchResult => {
  const result = {};
  fetchResult?.data.forEach(item => (result[item.name] = item));
  return result;
};
