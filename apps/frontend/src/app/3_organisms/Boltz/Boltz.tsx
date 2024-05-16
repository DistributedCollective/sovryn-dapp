import React, { FC, useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { Button, Paragraph } from '@sovryn/ui';

import { GAS_LIMIT } from '../../../constants/gasLimits';
import { useAccount } from '../../../hooks/useAccount';
import { CreateReverseSwapResponse } from './Boltz.type';
import {
  getContracts,
  prefix0x,
  satoshiToWei,
  streamSwapStatus,
  swapToBTC,
} from './Boltz.utils';
import EtherSwapABI from './EtherSwap.json';

export const Boltz: FC = () => {
  const [status, setStatus] = useState('');
  const [preimage, setPreimage] = useState(
    'f3b183ddba1e9a02a74caed0e6b21dc0200c5116c176860d5045520e579a9eee',
  );
  const [reverseSwapData, setReverseSwapData] = useState<
    CreateReverseSwapResponse | undefined
  >({
    id: 'aIPGgv',
    invoice:
      'lntb100u1pjh3cc8sp5uvyq2239frqmlk2xtz920dkqw6sqtkfch435y2xgnjkna6dy3zaqpp57wcc8hd6r6dq9f6v4mgwdvsacqsqc5gkc9mgvr2sg4fqu4u6nmhqdpq2djkuepqw3hjq5jz23pjqctyv3ex2umnxqyp2xqcqz959qxpqysgqk4qzlkrs3vlfzw9r9m0uv7hh0dcg7epeeyw3rmxxl3ct9knkwek3fl87decw4gh8lt3dslev4akasz4znv9kg76lkhe7wp4c4danfucplxcw8y',
    refundAddress: '0x4217BD283e9Dc9A2cE3d5D20fAE34AA0902C28db',
    lockupAddress: '0x165F8E654b3Fe310A854805323718D51977ad95F',
    timeoutBlockHeight: 4591785,
    onchainAmount: 9645,
  });
  // const [swapData] = useState<CreateSwapResponse | undefined>({
  //   id: 'aIPGgv',
  //   invoice:
  //     'lntb100u1pjh3cc8sp5uvyq2239frqmlk2xtz920dkqw6sqtkfch435y2xgnjkna6dy3zaqpp57wcc8hd6r6dq9f6v4mgwdvsacqsqc5gkc9mgvr2sg4fqu4u6nmhqdpq2djkuepqw3hjq5jz23pjqctyv3ex2umnxqyp2xqcqz959qxpqysgqk4qzlkrs3vlfzw9r9m0uv7hh0dcg7epeeyw3rmxxl3ct9knkwek3fl87decw4gh8lt3dslev4akasz4znv9kg76lkhe7wp4c4danfucplxcw8y',
  //   claimAddress: '0x4217BD283e9Dc9A2cE3d5D20fAE34AA0902C28db',
  //   timeoutBlockHeight: 4591785,
  //   expectedAmount: 9645,
  // });

  const { signer, account } = useAccount();

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
        prefix0x(preimage),
        satoshiToWei(reverseSwapData?.onchainAmount),
        reverseSwapData?.refundAddress,
        reverseSwapData?.timeoutBlockHeight,
        {
          gasLimit: GAS_LIMIT.PROPOSAL_EXECUTE,
        },
      );

      await tx.wait();
    } catch (error) {
      console.log('error', error);
    }
  };

  // const lock = async () => {
  //   try {
  //     const data = await getContracts();
  //     const etherSwapAddress = data?.rsk.swapContracts.EtherSwap;

  //     if (!etherSwapAddress || !swapData) {
  //       return;
  //     }
  //     const contract = new Contract(etherSwapAddress, EtherSwapABI.abi, signer);

  //     const tx = await contract.lock(
  //       prefix0x(decodeInvoice(swapData?.invoice).preimageHash),
  //       swapData?.claimAddress,
  //       swapData?.timeoutBlockHeight,
  //       {
  //         value: satoshiToWei(swapData?.expectedAmount),
  //       },
  //       {
  //         gasLimit: GAS_LIMIT.PROPOSAL_EXECUTE,
  //       },
  //     );

  //     await tx.wait();
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  return (
    <div>
      {!reverseSwapData && (
        <Button
          onClick={() => {
            swapToBTC(10000, account).then(res => {
              setReverseSwapData(res?.data);
              setPreimage(res?.preimageHash || '');
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

      {status === 'transaction.confirmed' && (
        <div>
          <Button onClick={claim} text="Claim" className="mt-2" />
        </div>
      )}
    </div>
  );
};
