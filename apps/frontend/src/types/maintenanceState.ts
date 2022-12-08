type Maintenance = {
  id: number;
  name: string;
  label: string;
  isInMaintenance: boolean;
};

export type MaintenanceStates = {
  [id: string]: Maintenance;
};
