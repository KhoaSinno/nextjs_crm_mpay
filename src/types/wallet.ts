/**
 * Type definitions for wallet-related errors and responses
 */

export interface WalletError extends Error {
  code?: number;
  message: string;
  data?: unknown;
}

export interface SwitchChainError extends Error {
  code: number;
  message: string;
  data?: unknown;
}

export interface AddNetworkError extends Error {
  code: number;
  message: string;
  data?: unknown;
}

export interface ConnectError extends Error {
  code?: number;
  message: string;
  details?: string;
}

// Common error codes from wallet interactions
export const WalletErrorCodes = {
  USER_REJECTED_REQUEST: 4001,
  UNAUTHORIZED: 4100,
  UNSUPPORTED_METHOD: 4200,
  DISCONNECTED: 4900,
  CHAIN_DISCONNECTED: 4901,
  UNRECOGNIZED_CHAIN_ID: 4902,
  RESOURCE_NOT_FOUND: -32001,
  RESOURCE_UNAVAILABLE: -32002,
  TRANSACTION_REJECTED: -32003,
  METHOD_NOT_SUPPORTED: -32004,
  LIMIT_EXCEEDED: -32005,
  PARSE_ERROR: -32700,
} as const;

export type WalletErrorCode =
  (typeof WalletErrorCodes)[keyof typeof WalletErrorCodes];
