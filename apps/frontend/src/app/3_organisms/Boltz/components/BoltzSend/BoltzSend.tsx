import React, { FC, useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { Button, Input } from '@sovryn/ui';

import { GAS_LIMIT } from '../../../../../constants/gasLimits';
import { useAccount } from '../../../../../hooks/useAccount';
import { Swap } from '../../Boltz.type';
import {
  decodeInvoice,
  getContracts,
  prefix0x,
  satoshiToWei,
  streamSwapStatus,
  swapToLighting,
} from '../../Boltz.utils';
import EtherSwapABI from '../../EtherSwap.json';

export const BoltzSend: FC = () => {
  const [status, setStatus] = useState('');
  const [invoice, setInvoice] = useState('');
  const [swapData, setSwapData] = useState<Swap>();

  const { signer, account } = useAccount();

  useEffect(() => {
    const swap = localStorage.getItem('swap');

    if (swap) {
      setSwapData(JSON.parse(swap));
    }
  }, []);

  useEffect(() => {
    if (!swapData) {
      return;
    }
    streamSwapStatus(swapData?.id, setStatus);
  }, [swapData]);

  const lock = async () => {
    try {
      const data = await getContracts();
      const etherSwapAddress = data?.rsk.swapContracts.EtherSwap;

      if (!etherSwapAddress || !swapData) {
        return;
      }
      const contract = new Contract(etherSwapAddress, EtherSwapABI.abi, signer);

      const tx = await contract.lock(
        prefix0x(decodeInvoice(swapData?.invoice).preimageHash),
        swapData?.claimAddress,
        swapData?.timeoutBlockHeight,
        {
          value: satoshiToWei(swapData?.expectedAmount),
          gasLimit: GAS_LIMIT.BOLTZ_SEND,
        },
      );

      tx.wait();
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <div className="p-5 m-3 bg-gray-80 rounded">
      {!swapData && (
        <Button
          onClick={() => {
            swapToLighting(invoice, account).then(swap => {
              setSwapData(swap);
              localStorage.setItem('swap', JSON.stringify(swap));
            });
          }}
          disabled={!invoice}
          text="Rootstock -> Lightning"
        />
      )}
      {status && <div>status: {status}</div>}

      {!swapData && (
        <Input
          className="mt-2"
          onChange={e => setInvoice(e.target.value)}
          value={invoice}
          placeholder="invoice"
        />
      )}

      {status === 'transaction.claimed' && (
        <Button
          onClick={() => {
            setSwapData(undefined);
            setStatus('');
            localStorage.removeItem('swap');
          }}
          text="Reset"
          className="mt-2"
        />
      )}

      {status === 'invoice.set' && (
        <div>
          <Button onClick={lock} text="Send" className="mt-2" />
        </div>
      )}
    </div>
  );
};
