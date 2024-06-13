import Axios from 'axios';
import bolt11 from 'bolt11';

import { isMainnet } from '../../../../../utils/helpers';
import type {
  BoltzListener,
  ClaimReverseSwapBody,
  ClaimReverseSwapResponse,
  ContractsResponse,
  GetReversePairsResponse,
  GetSubmarineSwapPairsResponse,
  ReverseSwapBody,
  ReverseSwapResponse,
  ReverseSwapTransactionResponse,
  Status,
  SubmarineRefundBody,
  SubmarineRefundResponse,
  SubmarineSwapBody,
  SubmarineSwapResponse,
  SubmarineSwapTransactionResponse,
  SwapResponse,
} from './boltz.types';

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

const getSubmarineSwapPairs = () =>
  client
    .get<GetSubmarineSwapPairsResponse>('/swap/submarine')
    .then(res => res.data);

const getSwap = (id: string) =>
  client.get<SwapResponse>(`/swap/${id}`).then(res => res.data);

const submarineSwap = (body: Partial<SubmarineSwapBody>) =>
  client
    .post<SubmarineSwapResponse>('/swap/submarine', body)
    .then(res => res.data);

const getSubmarineSwapTransaction = (id: string) =>
  client
    .get<SubmarineSwapTransactionResponse>(`/swap/submarine/${id}/transaction`)
    .then(res => res.data);

const submarineRefund = (body: SubmarineRefundBody) =>
  client
    .post<SubmarineRefundResponse>('/swap/submarine/refund', body)
    .then(res => res.data);

const getReverseSwapPairs = () =>
  client.get<GetReversePairsResponse>('/swap/reverse').then(res => res.data);

const reverseSwap = (body: Partial<ReverseSwapBody>) =>
  client.post<ReverseSwapResponse>('/swap/reverse', body).then(res => res.data);

const getReverseSwapTransaction = (id: string) =>
  client
    .get<ReverseSwapTransactionResponse>(`/swap/reverse/${id}/transaction`)
    .then(res => res.data);

const claimReverseSwap = (body: ClaimReverseSwapBody) =>
  client
    .post<ClaimReverseSwapResponse>('/swap/reverse/claim', body)
    .then(res => res.data);

let socket: WebSocket;

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

const getContracts = () =>
  client.get<ContractsResponse>('/chain/contracts').then(res => res.data);

const decodeInvoice = (
  invoice: string,
): { satoshis: number; preimageHash: string; expiry?: number } => {
  try {
    const decoded = bolt11.decode(invoice);
    const preimageHash = decoded.tags.find(
      tag => tag.tagName === 'payment_hash',
    );
    return {
      satoshis: decoded.satoshis || 0,
      expiry: decoded.timeExpireDate,
      preimageHash: preimageHash?.data as string,
    };
  } catch (e) {
    throw new Error('invalid_invoice');
  }
};

const getRefundSignature = (id: string) =>
  client
    .get<{ signature: string }>(`/swap/submarine/${id}/refund`)
    .then(res => res.data.signature);

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
  getContracts,
  decodeInvoice,
  getRefundSignature,
};
