import React, { FC, useEffect, useState } from 'react';

import { Button, Paragraph } from '@sovryn/ui';

import { useAccount } from '../../../../../hooks/useAccount';
import { ReverseSwap } from '../../Boltz.type';
import { streamSwapStatus, swapToBTC } from '../../Boltz.utils';
import { useBoltz } from '../../hooks/useBoltz';

export const BoltzReceive: FC = () => {
  const [status, setStatus] = useState('');
  const [reverseSwapData, setReverseSwapData] = useState<ReverseSwap>();

  const { account } = useAccount();

  const { claim } = useBoltz();
  useEffect(() => {
    const swap = localStorage.getItem('reverse-swap');

    if (swap) {
      setReverseSwapData(JSON.parse(swap));
    }
  }, []);

  useEffect(() => {
    if (!reverseSwapData) {
      return;
    }
    streamSwapStatus(reverseSwapData?.id, setStatus);
  }, [reverseSwapData]);

  return (
    <div className="p-5 m-3 bg-gray-80 rounded">
      {!reverseSwapData && (
        <Button
          onClick={() => {
            swapToBTC(10000, account).then(swap => {
              setReverseSwapData(swap);
              localStorage.setItem('reverse-swap', JSON.stringify(swap));
            });
          }}
          text="Lightning -> Rootstock"
        />
      )}
      {status && <div>status: {status}</div>}
      {reverseSwapData && status !== 'transaction.confirmed' && (
        <div>
          Invoice:
          <Paragraph className="break-all w-100 mx-auto">
            {reverseSwapData.invoice}
          </Paragraph>
        </div>
      )}
      {status === 'invoice.settled' && (
        <Button
          onClick={() => {
            setReverseSwapData(undefined);
            setStatus('');
            localStorage.removeItem('reverse-swap');
          }}
          text="Reset"
          className="mt-2"
        />
      )}

      {status === 'transaction.confirmed' && (
        <div>
          <Button
            onClick={() => claim(reverseSwapData)}
            text="Claim"
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
};
