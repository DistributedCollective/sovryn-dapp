import { useRef, useEffect, useCallback, useState } from 'react';

import { Socket, io } from 'socket.io-client';

import { currentNetwork } from '../../../../utils/helpers';
import { endpoints } from '../config/endpoints';
import { DEPOSIT_FEE_SATS, DEPOSIT_FEE_DYNAMIC } from '../constants';
import { ReceiveEvents } from '../types';

type EventHandler = (event: string, value: any) => void;

export type HistoryItem = {
  id: number;
  dateAdded: string;
  btcadr: string;
  web3adr: string;
  status: string;
  txHash: string;
  type: string;
  valueBtc: number;
};

export function useDepositSocket(eventHandler?: EventHandler) {
  const socket = useRef<Socket>();
  const [connected, setConnected] = useState(false);

  const handleInput = useCallback(
    (type: any) => (value: any) => {
      if (eventHandler) {
        eventHandler(type, value);
      }
    },
    [eventHandler],
  );

  useEffect(() => {
    const { origin, pathname } = new URL(endpoints[currentNetwork]);

    socket.current = io(`${origin}/`, {
      reconnectionDelayMax: 10000,
      reconnectionAttempts: process.env.NODE_ENV === 'development' ? 1 : 5,
      path: pathname && pathname !== '/' ? pathname : '',
    });

    socket.current.on('connect', () => {
      const s = socket.current;
      setConnected(s?.connected || false);
      s?.on(ReceiveEvents.txAmount, handleInput(ReceiveEvents.txAmount));
      s?.on(ReceiveEvents.depositTx, handleInput(ReceiveEvents.depositTx));
      s?.on(ReceiveEvents.transferTx, handleInput(ReceiveEvents.transferTx));
    });

    socket.current.on(ReceiveEvents.disconnect, () => {
      setConnected(socket.current?.connected || false);
    });

    return () => {
      if (socket.current) {
        const s = socket.current;
        s.off(ReceiveEvents.txAmount);
        s.off(ReceiveEvents.depositTx);
        s.off(ReceiveEvents.transferTx);
        s.disconnect();
        socket.current = undefined;
        setConnected(false);
      }
    };
  }, [handleInput]);

  const getDepositAddress = useCallback(
    (address: string) =>
      new Promise<{
        btcadr: string;
        dateAdded: number;
        id: number;
        label: string;
        web3adr: string;
        signatures: Array<Object>;
      }>((resolve, reject) => {
        if (socket.current) {
          socket.current.emit(
            ReceiveEvents.getDepositAddress,
            address,
            (err, res) => {
              if (res) {
                resolve(res);
              } else {
                reject(new Error(err?.error || err));
              }
            },
          );
        } else {
          reject(new Error('socket not connected'));
        }
      }),
    [],
  );

  const getDepositHistory = useCallback(
    (address: string) =>
      new Promise<HistoryItem[]>((resolve, reject) => {
        if (socket.current) {
          socket.current.emit(ReceiveEvents.getDepositHistory, address, res =>
            resolve(res),
          );
        } else {
          reject(new Error('socket not connected'));
        }
      }),
    [],
  );

  const getTxAmount = useCallback(
    () =>
      new Promise<{
        min: number;
        max: number;
        baseFee: number;
        dynamicFee: number;
      }>((resolve, reject) => {
        if (socket.current) {
          socket.current.emit(ReceiveEvents.txAmount, res => {
            resolve({
              ...res,
              min: res.min < 0.0005 ? 0.0005 : res.min, // overriding with hardcoded value for now
              baseFee: DEPOSIT_FEE_SATS,
              dynamicFee: DEPOSIT_FEE_DYNAMIC,
            });
          });
        } else {
          reject(new Error('socket not connected'));
        }
      }),
    [],
  );

  return {
    ready: connected,
    getDepositAddress,
    getDepositHistory,
    getTxAmount,
  };
}
