import { defineProperties } from '../internal/utils';

export enum SovrynErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',

  // Ethers errors
  ETHERS_CALL_EXCEPTION = 'ETHERS_CALL_EXCEPTION',
}

export interface SovrynError<T extends SovrynErrorCode = SovrynErrorCode>
  extends Error {
  code: T;
  details?: Record<string, any>;
  error?: Error;
}

export interface UnknownError
  extends SovrynError<SovrynErrorCode.UNKNOWN_ERROR> {
  [key: string]: any;
}

export interface NotImplemented
  extends SovrynError<SovrynErrorCode.NOT_IMPLEMENTED> {
  operation: string;
}

export interface CallExeptionError
  extends SovrynError<SovrynErrorCode.ETHERS_CALL_EXCEPTION> {
  reason: string;
}

export type CodedSovrynError<T> = T extends SovrynErrorCode.UNKNOWN_ERROR
  ? UnknownError
  : T extends SovrynErrorCode.NOT_IMPLEMENTED
  ? NotImplemented
  : T extends SovrynErrorCode.ETHERS_CALL_EXCEPTION
  ? CallExeptionError
  : never;

export const isSovrynError = <
  K extends SovrynErrorCode,
  T extends CodedSovrynError<K>,
>(
  error: any,
  code: K,
): error is T => (error && (error as SovrynError).code === code) as boolean;

export const makeError = <
  K extends SovrynErrorCode,
  T extends CodedSovrynError<K>,
>(
  message: string,
  code: K,
): T => {
  const error = new Error(message);
  error.name = 'SovrynError';

  defineProperties<SovrynError>(error as SovrynError, { code });

  return error as T;
};
