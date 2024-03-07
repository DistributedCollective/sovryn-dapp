import Axios from 'axios';

import { isMainnet } from '../../../../utils/helpers';

const baseUrl = isMainnet()
  ? 'https://api.boltz.exchange/api/v2'
  : 'https://testnet.boltz.exchange/api/v2';

const client = Axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  ok => ok,
  error =>
    Promise.reject(new Error(error.response?.data?.error || error.message)),
);

export enum StatusEnum {
  set = 'invoice.set',
  pending = 'invoice.pending',
  paid = 'invoice.paid',
  settled = 'invoice.settled',
  expired = 'invoice.expired',
  failedToPay = 'invoice.failedToPay',
  swapCreated = 'swap.created',
  swapExpired = 'swap.expired',
  txMempool = 'transaction.mempool',
  txConfirmed = 'transaction.confirmed',
  txFailed = 'transaction.failed',
  txClaimed = 'transaction.claimed',
  txRefunded = 'transaction.refunded',
  minerFeePaid = 'minerFee.paid',
}

export type Status = StatusEnum | string;

export type SubmarineSwapPair = {
  hash: string;
  rate: number;
  limits: {
    maximal: number;
    minimal: number;
    maximalZeroConf: number;
  };
  fees: {
    percentage: number;
    minerFees: number;
  };
};

export type GetSubmarineSwapPairsResponse = Record<
  string,
  Record<string, SubmarineSwapPair>
>;
const getSubmarineSwapPairs = () =>
  client
    .get<GetSubmarineSwapPairsResponse>('/swap/submarine')
    .then(res => res.data);

export type SubmarineSwapBody = {
  from: string;
  to: string;
  invoice: string;
  refundPublicKey: string;
  refundAddress: string;
  pairHash: string;
  referallId: string;
};

export type SubmarineSwapResponse = {
  id: string;
  bip21: string;
  address: string;
  swapTree: {
    claimLeaf: {
      version: number;
      output: string;
    };
    refundLeaf: {
      version: number;
      output: string;
    };
  };
  claimPublicKey: string;
  claimAddress: string;
  timeoutBlockHeight: number;
  acceptZeroConf: boolean;
  expectedAmount: number;
  blindingKey: string;
};

export type SwapResponse = {
  status: Status;
  zeroConfRejected: boolean;
  transaction: {
    id: string;
    hexh: string;
  };
};
const getSwap = (id: string) => client.get<SwapResponse>(`/swap/${id}`);

const submarineSwap = (body: Partial<SubmarineSwapBody>) =>
  client
    .post<SubmarineSwapResponse>('/swap/submarine', body)
    .then(res => res.data);

export type SubmarineSwapTransactionResponse = {
  id: string;
  hex: string;
  timeoutBlockHeight: number;
  timeoutEta: number;
};

const getSubmarineSwapTransaction = (id: string) =>
  client.get<SubmarineSwapTransactionResponse>(
    `/swap/submarine/${id}/transaction`,
  );

export type SubmarineRefundBody = {
  id: string;
  pubNonce: string;
  transaction: string;
  index: number;
};
export type SubmarineRefundResponse = {};

const submarineRefund = (body: SubmarineRefundBody) =>
  client
    .post<SubmarineRefundResponse>('/swap/submarine/refund', body)
    .then(res => res.data);

export type ReverseSwapPair = {
  hash: string;
  rate: number;
  limits: {
    maximal: number;
    minimal: number;
    maximalZeroConf: number;
  };
  fees: {
    percentage: number;
    minerFees: {
      claim: number;
      lockup: number;
    };
  };
};
export type GetReversePairsResponse = Record<
  string,
  Record<string, ReverseSwapPair>
>;
const getReverseSwapPairs = () =>
  client.get<GetReversePairsResponse>(`/swap/reverse`).then(res => res.data);

export type ReverseSwapBody = {
  from: string;
  to: string;
  preimageHash: string;
  claimPublicKey: string;
  claimAddress: string;
  invoiceAmount: number;
  onchainAmount: string;
  pairHash: string;
  referralId: string;
};
export type ReverseSwapResponse = {
  id: string;
  invoice: string;
  swapTree: {
    claimLeaf: {
      version: number;
      output: string;
    };
    refundLeaf: {
      version: number;
      output: string;
    };
  };
  lockupAddress: string;
  refundPublicKey: string;
  refundAddress: string;
  timeoutBlockHeight: number;
  onchainAmount: number;
  blindinKey: string;
};

const reverseSwap = (body: Partial<ReverseSwapBody>) =>
  client.post<ReverseSwapResponse>(`/swap/reverse`, body).then(res => res.data);

export type ReverseSwapTransactionResponse = {
  id: string;
  hex: string;
  timeoutBlockHeight: number;
};
const getReverseSwapTransaction = (id: string) =>
  client
    .get<ReverseSwapTransactionResponse>(`/swap/reverse/${id}/transaction`)
    .then(res => res.data);

export type ClaimReverseSwapBody = {
  id: string;
  preimage: string;
  pubNonce: string;
  transaction: string;
  index: number;
};
export type ClaimReverseSwapResponse = {
  pubNonce: string;
  partialSignature: string;
};
const claimReverseSwap = (body: ClaimReverseSwapBody) =>
  client
    .post<ClaimReverseSwapResponse>(`/swap/reverse/claim`, body)
    .then(res => res.data);

let socket: WebSocket;

export type BoltzListener = {
  status: (cb: (data: { id: string; status: Status }) => void) => () => void;
  close: () => void;
};

const listen = (id: string | string[]): BoltzListener => {
  if (socket) {
    socket.close();
  }
  socket = new WebSocket(`${baseUrl.replace('https://', 'wss://')}/ws`);

  socket.addEventListener('open', () => {
    socket.send(
      JSON.stringify({
        op: 'subscribe',
        channel: 'swap.update',
        args: Array.isArray(id) ? id : [id],
      }),
    );
  });

  return {
    status: (cb: (data: { id: string; status: Status }) => void) => {
      const listener = (raw: MessageEvent) => {
        const msg = JSON.parse(raw.data);
        if (msg.event !== 'update') {
          return;
        }

        const status = msg.args[0].status;
        const id = msg.args[0].id;

        cb({ id, status });
      };

      socket.addEventListener('message', listener);

      return () => {
        socket.removeEventListener('message', listener);
      };
    },
    close: () => {
      socket.close();
    },
  };
};

export const boltz = {
  getSubmarineSwapPairs,
  submarineSwap,
  getSwap,
  getSubmarineSwapTransaction,
  submarineRefund,
  getReverseSwapPairs,
  reverseSwap,
  getReverseSwapTransaction,
  claimReverseSwap,
  listen,
};
