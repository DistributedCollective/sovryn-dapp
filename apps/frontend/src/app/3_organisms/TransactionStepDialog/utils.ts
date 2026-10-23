import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/providers';

import { BigNumber, BigNumberish, Contract } from 'ethers/lib/ethers';
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

/**
 * How far above a fresh gas estimate a configured-gas-limit transaction's
 * limit is set, in percent. A withdrawal hooked into the Perimeter's
 * withdrawal delay does more work than a plain transfer (it enqueues into
 * the delay queue and updates the receiver index), so a constant sized for
 * the un-hooked call can undershoot; the margin also covers an estimate
 * reading slightly cheaper state than the block the transaction actually
 * lands in.
 */
const GAS_ESTIMATE_MARGIN_PERCENT = 30;

/** Gas estimation failed and the request named no constant to fall back to. */
const NO_ESTIMATE_FALLBACK_GAS_LIMIT = BigNumber.from(6_000_000);

/**
 * The gas limit to open a transaction step with, or to re-derive for its
 * "Reset values" control.
 *
 * With no `floor`, this is a plain estimate of the call — the flat 6,000,000
 * fallback on failure existed before this function did and is kept as-is.
 *
 * With a `floor` (a request that configured a flat constant), the constant
 * is no longer used outright: it is re-priced against a fresh estimate of
 * this exact call, raised by `GAS_ESTIMATE_MARGIN_PERCENT`, and never sent
 * lower than `floor` itself. Falls back to `floor` outright when the
 * estimate fails — a call that cannot be estimated is either going to
 * revert regardless of the limit chosen, or the node does not support
 * estimation, and either way `floor` is the best number left to send.
 */
export const resolveGasLimit = async (
  contract: Contract,
  fnName: string,
  args: unknown[],
  value: BigNumberish | undefined,
  floor?: BigNumberish,
): Promise<string> => {
  try {
    const estimate = await contract.estimateGas[fnName](...args, {
      value: value ?? 0,
    });
    if (floor === undefined) {
      return estimate.toString();
    }
    const floorBn = BigNumber.from(floor);
    const withMargin = estimate.mul(100 + GAS_ESTIMATE_MARGIN_PERCENT).div(100);
    return withMargin.gt(floorBn) ? withMargin.toString() : floorBn.toString();
  } catch {
    return floor !== undefined
      ? BigNumber.from(floor).toString()
      : NO_ESTIMATE_FALLBACK_GAS_LIMIT.toString();
  }
};

export const sendOrSimulateTx = async (
  request: SignTransactionRequest,
  args: string[],
  config: TransactionConfig = {},
): Promise<TransactionResponse> => {
  const from = await request.contract.signer.getAddress();
  const nonce = await request.contract.provider.getTransactionCount(
    await request.contract.signer.getAddress(),
  );

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
    nonce,
    from,
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
