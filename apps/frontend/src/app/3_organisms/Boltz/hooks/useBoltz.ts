import { useCallback } from 'react';

import { Contract } from 'ethers';

import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useAccount } from '../../../../hooks/useAccount';
import { ReverseSwap, Swap } from '../Boltz.type';
import {
  decodeInvoice,
  getContracts,
  prefix0x,
  satoshiToWei,
} from '../Boltz.utils';
import EtherSwapABI from '../EtherSwap.json';

export const useBoltz = () => {
  const { signer } = useAccount();

  const lock = useCallback(
    async (swapData: Swap | undefined) => {
      try {
        const data = await getContracts();
        const etherSwapAddress = data?.rsk.swapContracts.EtherSwap;

        if (!etherSwapAddress || !swapData) {
          return;
        }
        const contract = new Contract(
          etherSwapAddress,
          EtherSwapABI.abi,
          signer,
        );

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
    },
    [signer],
  );

  const claim = async (reverseSwapData: ReverseSwap | undefined) => {
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

  return { lock, claim };
};
