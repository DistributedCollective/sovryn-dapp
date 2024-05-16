import React, { FC, useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { Button, Paragraph } from '@sovryn/ui';

import { GAS_LIMIT } from '../../../../../constants/gasLimits';
import { useAccount } from '../../../../../hooks/useAccount';
import { ReverseSwap } from '../../Boltz.type';
import {
  getContracts,
  prefix0x,
  satoshiToWei,
  streamSwapStatus,
  swapToBTC,
} from '../../Boltz.utils';
import EtherSwapABI from '../../EtherSwap.json';

export const BoltzReceive: FC = () => {
  const [status, setStatus] = useState('');
  const [reverseSwapData, setReverseSwapData] = useState<ReverseSwap>();

  const { signer, account } = useAccount();

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

  const claim = async () => {
    try {
      const data = await getContracts();
      const etherSwapAddress = data?.rsk.swapContracts.EtherSwap;

      if (!etherSwapAddress || !reverseSwapData) {
        return;
      }
      const contract = new Contract(etherSwapAddress, EtherSwapABI.abi, signer);

      const tx = await contract.claim(
        prefix0x(reverseSwapData.preimage),
        satoshiToWei(reverseSwapData?.onchainAmount),
        reverseSwapData?.refundAddress,
        reverseSwapData?.timeoutBlockHeight,
        {
          gasLimit: GAS_LIMIT.BOLTZ_RECEIVE,
        },
      );

      await tx.wait();
    } catch (error) {
      console.log('error', error);
    }
  };

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
          <Button onClick={claim} text="Claim" className="mt-2" />
        </div>
      )}
    </div>
  );
};
