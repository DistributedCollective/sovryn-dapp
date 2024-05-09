import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/providers';

import { BigNumber } from 'ethers/lib/ethers';
import { parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { ChainIds } from '@sovryn/ethers-provider';
import { NotificationType, StatusType } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { simulateTx } from '../../../utils/simulator/simulateTx';
import { SimulatedTx } from '../../../utils/simulator/types';
import {
  SignTransactionRequest,
  TransactionConfig,
} from './TransactionStepDialog.types';

export const handleNotification = (
  type: NotificationType,
  title: string,
  content = '',
  className = 'text-xs',
) => ({
  type,
  id: nanoid(),
  title: t(title),
  content: t(content),
  dismissible: true,
  className,
});

export const renderNotification = (txStatus: StatusType) => {
  const [title, subtitle] =
    txStatus === StatusType.success
      ? [translations.transactionStep.transactionSuccessTitle]
      : [
          translations.common.tx.failedTitle,
          translations.common.tx.failedSubtitle,
        ];

  const type =
    txStatus === StatusType.success
      ? NotificationType.success
      : NotificationType.error;

  return handleNotification(type, title, subtitle);
};

export const sendOrSimulateTx = async (
  request: SignTransactionRequest,
  args: string[],
  config: TransactionConfig = {},
): Promise<TransactionResponse> => {
  // const nonce = await request.contract.provider.getTransactionCount(
  //   await request.contract.signer.getAddress(),
  // );

  const gasLimit = config.gasLimit ? config.gasLimit?.toString() : undefined;
  const gasPrice = config.gasPrice
    ? parseUnits(config.gasPrice?.toString() || '0', 9)
    : undefined;

  if (process.env.REACT_APP_SIMULATE_TX === 'true') {
    try {
      const { address, interface: iface, provider, signer } = request.contract;
      const chainId = (await provider.getNetwork()).chainId;

      const input = iface.encodeFunctionData(request.fnName, args);
      const from = await signer.getAddress();

      const tx = await simulateTx(chainId as unknown as ChainIds, [
        {
          to: address,
          from,
          input,
          value: request.value ? request.value.toString() : '0',
          gas: gasLimit ? Number(gasLimit) : 0,
          gas_price: gasPrice ? gasPrice.toString() : '0',
        },
      ]);

      console.log('SIMULATOR RESULT:', tx);

      return wrapAsTx(tx[0]);
    } catch (e) {
      console.error('SIMULATOR ERROR: ', e);
      throw e;
    }
  }

  return request.contract[request.fnName](...args, {
    value: request.value ?? '0',
    gasPrice,
    gasLimit,
    // nonce,
  });
};

const wrapAsTx = (simulation: SimulatedTx): TransactionResponse => {
  const { transaction } = simulation;
  const wait = (confirmations?: number) =>
    new Promise<TransactionReceipt>((resolve, reject) => {
      const result = {
        to: transaction.to,
        from: transaction.from,
        contractAddress: '',
        transactionIndex: 0,
        gasUsed: BigNumber.from(transaction.gas),
        logsBloom: '',
        blockHash: transaction.block_hash,
        blockNumber: transaction.block_number,
        transactionHash: transaction.hash,
        logs: [],
        confirmations: confirmations || 1,
        cumulativeGasUsed: BigNumber.from(transaction.gas_used),
        effectiveGasPrice: BigNumber.from(transaction.gas_price),
        byzantium: true,
        type: 0,
        status: transaction.status ? 1 : 0,
      };
      setTimeout(() => {
        if (transaction.status) {
          resolve(result);
        } else {
          console.log('-'.repeat(80));
          console.log(
            'Simulated transaction failed',
            transaction.error_message,
          );
          console.log(simulation);
          console.log('-'.repeat(80));
          reject(result);
        }
      }, 3_000);
    });

  return {
    hash: transaction.hash,
    confirmations: 1,
    from: transaction.from,
    gasLimit: BigNumber.from(transaction.gas),
    gasPrice: BigNumber.from(transaction.gas_price),
    nonce: transaction.nonce,
    to: transaction.to,
    value: BigNumber.from(transaction.value === '0x' ? '0' : transaction.value),
    data: transaction.input,
    chainId: Number(transaction.network_id),
    wait,
  };
};
