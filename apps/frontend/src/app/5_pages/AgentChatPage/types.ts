export enum Sender {
  User = 'user',
  Agent = 'agent',
}

export interface RawTransaction {
  to: string;
  data: string;
  value?: string;
  chainId?: number;
  description?: string;
  gasLimit?: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  transactions?: RawTransaction[];
  timestamp: number;
}
