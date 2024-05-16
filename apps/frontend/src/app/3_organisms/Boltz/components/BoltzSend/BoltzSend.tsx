import React, { FC, useEffect, useState } from 'react';

import { Button, Input } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { Swap } from '../../Boltz.type';
import { streamSwapStatus, swapToLighting } from '../../Boltz.utils';
import { useBoltz } from '../../hooks/useBoltz';

export const BoltzSend: FC = () => {
  const [status, setStatus] = useState('');
  const [invoice, setInvoice] = useState('');
  const [swapData, setSwapData] = useState<Swap>();

  const { lock } = useBoltz();
  const { account } = useAccount();

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
          <Button onClick={() => lock(swapData)} text="Send" className="mt-2" />
        </div>
      )}
    </div>
  );
};
