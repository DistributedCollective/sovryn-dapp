import { JsonRpcSigner } from '@ethersproject/providers';
import {
  PERMIT2_ADDRESS,
  PermitTransferFrom,
  SignatureTransfer,
  MaxAllowanceTransferAmount,
} from '@uniswap/permit2-sdk';

import dayjs, { ManipulateType } from 'dayjs';
import { BigNumber, BigNumberish, constants, ethers } from 'ethers';
import { t } from 'i18next';

import { getTokenContract, SupportedTokens } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';
import { PermitTransactionResponse } from '@sovryn/sdk';
import { Decimal } from '@sovryn/utils';

import {
  Transaction,
  TransactionReceipt,
  TransactionReceiptStatus,
  TransactionRequest,
  TransactionType,
} from '../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { APPROVAL_FUNCTION } from '../constants/general';
import { getTokenDisplayName } from '../constants/tokens';
import { translations } from '../locales/i18n';
import { getRskChainId } from './chain';

export const toDeadline = (expiration: number): number => {
  return Math.floor((Date.now() + expiration) / 1000);
};

export const UNSIGNED_PERMIT = {
  deadline: 0,
  v: 0,
  r: constants.HashZero,
  s: constants.HashZero,
} as PermitTransactionResponse;

export const EMPTY_PERMIT_TRANSFER_FROM = {
  permitted: {
    token: constants.AddressZero,
    amount: Decimal.ONE.toString(),
  },
  spender: constants.AddressZero,
  nonce: 0,
  deadline: toDeadline(1000 * 60 * 60 * 24 * 30 /** 30 days */),
} as PermitTransferFrom;

export const DEFAULT_SIGNATURE =
  '0x86638c772f972d496f6671bc8157498b853ef064f134e813ddd25269c6a01a385ed8032201f3b91a84b46d75bb3ea50c919a576927975bab5b91829833eb8e111c';

type PreparePermitTransactionOptions = {
  token: SupportedTokens;
  signer: JsonRpcSigner;
  spender: string;
  value?: string;
  deadline?: number;
  nonce?: number;
  chain?: ChainId;
};

export const preparePermitTransaction = async ({
  token = SupportedTokens.dllr,
  chain = getRskChainId(),
  signer,
  spender,
  value,
  deadline = prepareDeadline(),
  nonce,
}: PreparePermitTransactionOptions): Promise<Transaction> => {
  const { address: tokenAddress } = await getTokenContract(token, chain);
  return {
    title: t(translations.common.tx.signPermitTitle, {
      symbol: getTokenDisplayName(token),
    }),
    subtitle: t(translations.common.tx.signPermitSubtitle, {
      symbol: getTokenDisplayName(token),
    }),
    request: {
      type: TransactionType.signPermit,
      signer,
      token: tokenAddress,
      owner: await signer.getAddress(),
      spender,
      value,
      deadline,
      nonce,
    },
  };
};

export const preparePermit2Transaction = async (
  permit: PermitTransferFrom,
  signer: JsonRpcSigner,
): Promise<Transaction> => {
  const { domain, types, values } = SignatureTransfer.getPermitData(
    permit,
    PERMIT2_ADDRESS,
    parseInt(getRskChainId()),
  );

  return {
    title: 'Permit2 for DLLR',
    subtitle: 'This is bringing back DLLR and permits',
    request: {
      type: TransactionType.signTypedData,
      domain,
      types,
      value: values,
      signer,
    },
  };
};

export const getPermitTransferFrom = async (
  spender: string,
  amount: string,
  nonce: number,
  token = SupportedTokens.dllr,
): Promise<PermitTransferFrom> => {
  const { address: tokenAddress } = await getTokenContract(
    token,
    getRskChainId(),
  );

  const permitTransferFrom: PermitTransferFrom = {
    permitted: {
      token: tokenAddress,
      amount,
    },
    spender,
    nonce,
    deadline: toDeadline(1000 * 60 * 60 * 24 * 30 /** 30 days */),
  };

  return permitTransferFrom;
};

type PrepareApproveTransactionOptions = {
  token: SupportedTokens;
  chain?: ChainId;
  spender: string;
  amount?: BigNumberish;
  signer?: JsonRpcSigner;
  contract?: ethers.Contract;
  approveMaximumAmount?: boolean;
};

export const prepareApproveTransaction = async ({
  token = SupportedTokens.dllr,
  chain = getRskChainId(),
  spender,
  amount = '0',
  signer,
  contract,
  approveMaximumAmount = false,
}: PrepareApproveTransactionOptions): Promise<Transaction | undefined> => {
  const loadTokenContract = async () => {
    if (contract) {
      return contract;
    } else if (signer) {
      const { address: tokenAddress, abi } = await getTokenContract(
        token,
        chain,
      );
      return new ethers.Contract(tokenAddress, abi, signer);
    }

    throw new Error('signer or contract must provided, but not both.');
  };

  const tokenContract = await loadTokenContract();
  const owner = await tokenContract.signer.getAddress();

  const allowance = await tokenContract.allowance(owner, spender);

  if (BigNumber.from(allowance).lt(amount)) {
    return {
      title: t(translations.common.tx.signApproveTitle, {
        symbol: getTokenDisplayName(token),
      }),
      subtitle: t(translations.common.tx.signApproveSubtitle, {
        symbol: getTokenDisplayName(token),
      }),
      request: {
        type: TransactionType.signTransaction,
        contract: tokenContract,
        fnName: APPROVAL_FUNCTION,
        args: [
          spender,
          approveMaximumAmount ? MaxAllowanceTransferAmount : amount,
        ],
      },
    };
  }
};

export const permitHandler =
  (
    override: (
      req: TransactionRequest,
      res: string | PermitTransactionResponse | undefined,
    ) => TransactionRequest | Promise<TransactionRequest>,
    permitIndex: number = 0,
  ) =>
  (request: TransactionRequest, receipts: TransactionReceipt[]) => {
    if (
      receipts.length &&
      receipts[permitIndex]?.status === TransactionReceiptStatus.success &&
      (receipts[permitIndex]?.request.type === TransactionType.signPermit ||
        receipts[permitIndex]?.request.type === TransactionType.signTypedData)
    ) {
      return override(request, receipts[permitIndex].response);
    }

    return request;
  };

export const prepareDeadline = (
  value: number = 1,
  unit: ManipulateType = 'hour',
) => dayjs().add(value, unit).unix();
