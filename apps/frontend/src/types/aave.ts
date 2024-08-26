export type TransactionFactoryOptions = { onComplete?: () => void };

export enum BorrowRateMode {
  STABLE = 1,
  VARIABLE = 2,
}
