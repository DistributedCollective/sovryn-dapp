export enum RUNES_USE_CASE_ACTIONS {
  convert = 'convert',
  deposit = 'deposit',
}

export type Rune = {
  symbol: string;
  icon?: string;
};

export type AvailableRunes = Record<string, Rune>;
