export enum LOCHistoryType {
  lineOfCredit = 'lineOfCredit',
  collateralSurplus = 'collateralSurplus',
}

export type LOCHistoryProps = {
  selectedHistoryType: LOCHistoryType;
  onChangeLOCHistory: (value: LOCHistoryType) => void;
};
