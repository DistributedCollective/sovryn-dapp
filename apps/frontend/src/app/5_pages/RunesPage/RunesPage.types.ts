export enum RUNES_USE_CASE_ACTIONS {
  convert = 'convert',
  deposit = 'deposit',
}

export type Rune = {
  name: string;
  icon?: string;
};

export type AvailableRunes = Record<string, Rune>;
