import {
  BigNumber,
  Contract,
  PopulatedTransaction,
  Transaction,
  utils,
} from 'ethers';

import { L1_GAS_PRICE_ORACLE_ABI } from '../abis/external/L1GasPriceOracle';
import { CrocEnv } from '../croc';

// Applied to all gas estimates.
export const GAS_PADDING = 30000;

/**
 * Compute the raw transaction data for a given transaction.
 *
 * ref: https://docs.ethers.org/v5/cookbook/transactions/#cookbook--compute-raw-transaction
 */
export function getRawTransaction(tx: Transaction) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addKey(accum: any, key: keyof Transaction) {
    if (tx[key]) {
      accum[key] = tx[key];
    }
    return accum;
  }

  // Extract the relevant parts of the transaction and signature
  const txFields = [
    'accessList',
    'chainId',
    'data',
    'gasPrice',
    'gasLimit',
    'maxFeePerGas',
    'maxPriorityFeePerGas',
    'nonce',
    'to',
    'type',
    'value',
  ] as const;
  const sigFields = ['v', 'r', 's'] as const;

  // Serialize the signed transaction
  const raw = utils.serializeTransaction(
    txFields.reduce(addKey, {}),
    sigFields.reduce(addKey, {}),
  );

  // Double check things went well
  if (utils.keccak256(raw) !== tx.hash) {
    throw new Error('serializing failed!');
  }

  return raw as `0x${string}`;
}

/**
 * Compute the raw transaction data for a given transaction without the signature.
 *
 * ref: https://docs.ethers.org/v5/cookbook/transactions/#cookbook--compute-raw-transaction
 */
export function getUnsignedRawTransaction(tx: PopulatedTransaction) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addKey(accum: any, key: keyof PopulatedTransaction) {
    if (tx[key]) {
      accum[key] = tx[key];
    }
    return accum;
  }

  // Extract the relevant parts of the transaction and signature
  const txFields = [
    'accessList',
    'chainId',
    'data',
    'gasPrice',
    'gasLimit',
    'maxFeePerGas',
    'maxPriorityFeePerGas',
    'nonce',
    'to',
    'type',
    'value',
  ] as const;

  // Serialize the signed transaction
  const raw = utils.serializeTransaction(txFields.reduce(addKey, {}));

  return raw as `0x${string}`;
}

/**
 * Estimates the additional L1 gas on Scroll for any data which is a RLP-encoded transaction with signature.
 */
export async function estimateScrollL1Gas(
  crocEnv: CrocEnv,
  rawTransaction: `0x${string}`,
): Promise<BigNumber> {
  const crocContext = await crocEnv.context;
  const chainId = crocContext.chain.chainId;
  const isScroll = chainId === '0x82750' || chainId === '0x8274f';
  if (!isScroll) {
    return BigNumber.from(0);
  }

  const L1_GAS_PRICE_ORACLE_ADDRESS =
    '0x5300000000000000000000000000000000000002';
  const l1GasPriceOracle = new Contract(
    L1_GAS_PRICE_ORACLE_ADDRESS,
    L1_GAS_PRICE_ORACLE_ABI,
    crocContext.provider,
  );

  // function getL1Fee(bytes memory _data) external view override returns (uint256);
  const l1Gas = (await l1GasPriceOracle.getL1Fee(rawTransaction)) as BigNumber;
  return l1Gas;
}
