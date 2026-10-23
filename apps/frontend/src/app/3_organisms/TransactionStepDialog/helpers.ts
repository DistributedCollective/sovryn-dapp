import {
  SendRefusal,
  SignMessageRequest,
  SignTransactionDataRequest,
  SignTransactionRequest,
  SignTypedDataRequest,
  TransactionRequest,
  TransactionType,
} from './TransactionStepDialog.types';

export const isMessageSignatureRequest = (
  request: TransactionRequest,
): request is SignMessageRequest =>
  request.type === TransactionType.signMessage;

export const isTypedDataRequest = (
  request: TransactionRequest,
): request is SignTypedDataRequest =>
  request.type === TransactionType.signTypedData;

export const isTransactionRequest = (
  request: TransactionRequest,
): request is SignTransactionRequest =>
  request.type === TransactionType.signTransaction;

export const isSignTransactionDataRequest = (
  request: TransactionRequest,
): request is SignTransactionDataRequest =>
  request.type === TransactionType.signTransactionData;

/**
 * What a send check rejects with when it refuses a transaction: nothing is
 * sent, and `reasons` are the lines that say why, as the user was told them.
 */
export const sendRefusal = (reasons: string[]): SendRefusal =>
  Object.assign(new Error('The send check refused, so nothing was sent.'), {
    notSentReasons: reasons,
  });

/** The reasons a send check's rejection names; none when it names none. */
export const notSentReasonsOf = (rejection: unknown): string[] => {
  const reasons = (rejection as Partial<SendRefusal> | undefined)
    ?.notSentReasons;
  return Array.isArray(reasons)
    ? reasons.filter((reason): reason is string => typeof reason === 'string')
    : [];
};
