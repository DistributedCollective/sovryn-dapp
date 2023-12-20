import axios from 'axios';
import { crypto } from 'bitcoinjs-lib';
import bolt11 from 'bolt11';
import { randomBytes } from 'crypto';
import { getAddress, parseUnits } from 'ethers/lib/utils';

import { defaultChainId } from '../../../config/chains';

import { BOLTZ_URL } from './Boltz.constants';
import {
  BoltzPair,
  CheckSwapStatusResponse,
  CreateReverseSwapResponse,
  CreateSwapResponse,
  GetContractsResponse,
  ReverseSwap,
  Swap,
} from './Boltz.type';

export const getPair = async () => {
  try {
    const { data } = await axios.get(BOLTZ_URL[defaultChainId] + 'getpairs');

    return data.pairs['RBTC/BTC'] as BoltzPair;
  } catch (error) {}
};

export const checkSwapStatus = async (id: string) => {
  try {
    const { data } = await axios.post<CheckSwapStatusResponse>(
      BOLTZ_URL[defaultChainId] + 'swapstatus',
      {
        id,
      },
    );

    return data.status;
  } catch (error) {}
};

export const streamSwapStatus = async (
  id: string,
  cb: (status: any) => void,
) => {
  const stream = new EventSource(
    BOLTZ_URL[defaultChainId] + '/streamswapstatus?id=' + id,
  );

  stream.onmessage = function (event) {
    const data = JSON.parse(event.data);

    cb(data.status);
  };

  return stream;
};

export const swapToBTC = async (
  amount: number,
  account: string,
): Promise<ReverseSwap> => {
  try {
    const preimage = randomBytes(32);
    const preimageHash = crypto.sha256(preimage).toString('hex');
    account = getAddress(account);

    const pair = await getPair();

    const params = {
      type: 'reversesubmarine',
      pairId: 'RBTC/BTC',
      orderSide: 'buy',
      invoiceAmount: amount,
      preimageHash: preimageHash,
      claimAddress: account,
      pairHash: pair?.hash,
    };

    const { data } = await axios.post<CreateReverseSwapResponse>(
      BOLTZ_URL[defaultChainId] + 'createswap',
      params,
    );

    return {
      asset: 'RBTC',
      date: Date.now(),
      onchainAddress: account,
      preimage: preimageHash,
      receiveAmount: data.onchainAmount,
      reverse: true,
      sendAmount: amount,
      ...data,
    };
  } catch (error) {
    throw error;
  }
};

export const swapToLighting = async (
  invoice: string,
  account: string,
): Promise<Swap> => {
  try {
    account = getAddress(account);

    const pair = await getPair();

    const params = {
      orderSide: 'sell',
      type: 'submarine',
      pairId: 'RBTC/BTC',
      invoice,
      pairHash: pair?.hash,
    };

    const { data } = await axios.post<CreateSwapResponse>(
      BOLTZ_URL[defaultChainId] + 'createswap',
      params,
    );

    return {
      asset: 'RBTC',
      date: Date.now(),
      onchainAddress: account,
      reverse: true,
      invoice,
      ...data,
    };
  } catch (error) {
    throw error;
  }
};

export const getContracts = async () => {
  try {
    const { data } = await axios.get<GetContractsResponse>(
      BOLTZ_URL[defaultChainId] + 'getcontracts',
    );

    return data;
  } catch (error) {}
};

export const satoshiToWei = (satoshis: number) =>
  parseUnits(satoshis.toString(), 10);

export const prefix0x = (val: string) => `0x${val}`;

export const decodeInvoice = (
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
