export enum Environments {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}
export enum ExplorerNetworkURI {
  Testnet = 'https://explorer.testnet.rsk.co',
  Mainnet = 'https://explorer.rsk.co',
}
export enum Services {
  Maintenance = 'maintenance',
  Notification = 'notification',
  Amm = 'amm',
}

export type ReleaseFileContent = {
  version: string;
  forcedCount: number;
  commit: string;
  comment?: string;
};

export type Nullable<T = any> = T | null;
