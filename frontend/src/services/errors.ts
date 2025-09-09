/**
 * Custom Error Classes for Chasqui App
 * Provides better error categorization and handling
 */

import { logger } from './logger'

// Base error class
export class ChasquiError extends Error {
  public readonly code: string
  public readonly context: string
  public readonly timestamp: string
  public readonly originalError?: any

  constructor(
    message: string,
    code: string,
    context: string,
    originalError?: any
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context
    this.timestamp = new Date().toISOString()
    this.originalError = originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    // Log error automatically
    logger.error(context, message, originalError)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
      originalError: this.originalError?.message || this.originalError
    }
  }
}

// Web3 specific errors
export class Web3Error extends ChasquiError {
  constructor(message: string, code: string, originalError?: any) {
    super(message, code, 'Web3Service', originalError)
  }

  static connectionFailed(originalError?: any): Web3Error {
    return new Web3Error(
      'Failed to connect to MetaMask. Please make sure MetaMask is installed and unlocked.',
      'CONNECTION_FAILED',
      originalError
    )
  }

  static wrongNetwork(expected: string, current: string): Web3Error {
    return new Web3Error(
      `Wrong network detected. Expected ${expected}, but connected to ${current}`,
      'WRONG_NETWORK'
    )
  }

  static contractNotFound(contractAddress: string) {
    return new Web3Error(
      `Contract not found at address: ${contractAddress}`,
      'CONTRACT_NOT_FOUND',
      { contractAddress }
    )
  }

  static walletNotConnected() {
    return new Web3Error(
      'Wallet is not connected',
      'WALLET_NOT_CONNECTED'
    )
  }

  static transactionFailed(reason: string, originalError?: any): Web3Error {
    return new Web3Error(
      `Transaction failed: ${reason}`,
      'TRANSACTION_FAILED',
      originalError
    )
  }

  static insufficientFunds(required: string, available: string): Web3Error {
    return new Web3Error(
      `Insufficient funds. Required: ${required}, Available: ${available}`,
      'INSUFFICIENT_FUNDS'
    )
  }

  static userRejectedTransaction(): Web3Error {
    return new Web3Error(
      'Transaction was rejected by user',
      'USER_REJECTED'
    )
  }
}

// Authentication errors
export class AuthError extends ChasquiError {
  constructor(message: string, code: string, originalError?: any) {
    super(message, code, 'AuthStore', originalError)
  }

  static notConnected(): AuthError {
    return new AuthError(
      'Wallet not connected. Please connect your wallet first.',
      'NOT_CONNECTED'
    )
  }

  static notAuthorized(address: string): AuthError {
    return new AuthError(
      `Address ${address} is not authorized to perform this action`,
      'NOT_AUTHORIZED'
    )
  }

  static metaMaskNotFound(): AuthError {
    return new AuthError(
      'MetaMask not found. Please install MetaMask extension.',
      'METAMASK_NOT_FOUND'
    )
  }
}

// Task/Escrow specific errors
export class TaskError extends ChasquiError {
  constructor(message: string, code: string, originalError?: any) {
    super(message, code, 'TaskManager', originalError)
  }

  static invalidBeneficiary(address: string): TaskError {
    return new TaskError(
      `Invalid beneficiary address: ${address}`,
      'INVALID_BENEFICIARY'
    )
  }

  static invalidAmount(amount: string): TaskError {
    return new TaskError(
      `Invalid amount: ${amount}. Amount must be greater than 0`,
      'INVALID_AMOUNT'
    )
  }

  static taskNotFound(id: string): TaskError {
    return new TaskError(
      `Task with ID ${id} not found`,
      'TASK_NOT_FOUND'
    )
  }

  static taskAlreadyCompleted(id: string): TaskError {
    return new TaskError(
      `Task ${id} is already completed`,
      'TASK_ALREADY_COMPLETED'
    )
  }

  static taskAlreadyReleased(id: string): TaskError {
    return new TaskError(
      `Task ${id} funds have already been released`,
      'TASK_ALREADY_RELEASED'
    )
  }

  static notRegisteredForPrivacy(address: string): TaskError {
    return new TaskError(
      `Address ${address} is not registered for privacy features. Please register first.`,
      'NOT_REGISTERED_FOR_PRIVACY'
    )
  }
}

// Validation errors
export class ValidationError extends ChasquiError {
  public readonly field: string

  constructor(message: string, field: string, value?: any) {
    super(message, 'VALIDATION_ERROR', 'Validation', { field, value })
    this.field = field
  }

  static required(field: string): ValidationError {
    return new ValidationError(`${field} is required`, field)
  }

  static invalidFormat(field: string, expectedFormat: string, value?: any): ValidationError {
    return new ValidationError(
      `${field} has invalid format. Expected: ${expectedFormat}`,
      field,
      value
    )
  }

  static outOfRange(field: string, min: number, max: number, value?: any): ValidationError {
    return new ValidationError(
      `${field} is out of range. Must be between ${min} and ${max}`,
      field,
      value
    )
  }
}

// Generic application errors
export class AppError extends ChasquiError {
  constructor(message: string, code: string, context?: string, originalError?: any) {
    super(message, code, context || 'Application', originalError)
  }

  static networkError(originalError?: any): AppError {
    return new AppError(
      'Network error occurred. Please check your internet connection.',
      'NETWORK_ERROR',
      'Network',
      originalError
    )
  }

  static configurationError(message: string): AppError {
    return new AppError(
      `Configuration error: ${message}`,
      'CONFIGURATION_ERROR',
      'Config'
    )
  }
}

// Error handler utility function
export function handleError(error: any, context?: string): ChasquiError {
  // If it's already a ChasquiError, return as is
  if (error instanceof ChasquiError) {
    return error
  }

  // Handle common MetaMask errors
  if (error?.code === 4001) {
    return Web3Error.userRejectedTransaction()
  }

  if (error?.code === -32602 || error?.message?.includes('insufficient funds')) {
    return Web3Error.insufficientFunds('Unknown', 'Unknown')
  }

  if (error?.message?.includes('network')) {
    return AppError.networkError(error)
  }

  // Generic error wrapper
  return new AppError(
    error?.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    context,
    error
  )
}

// Export error types for easy access
export const ErrorCodes = {
  // Web3 errors
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  WRONG_NETWORK: 'WRONG_NETWORK',
  CONTRACT_NOT_FOUND: 'CONTRACT_NOT_FOUND',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  USER_REJECTED: 'USER_REJECTED',

  // Auth errors
  NOT_CONNECTED: 'NOT_CONNECTED',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  METAMASK_NOT_FOUND: 'METAMASK_NOT_FOUND',

  // Task errors
  INVALID_BENEFICIARY: 'INVALID_BENEFICIARY',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  TASK_ALREADY_COMPLETED: 'TASK_ALREADY_COMPLETED',
  TASK_ALREADY_RELEASED: 'TASK_ALREADY_RELEASED',
  NOT_REGISTERED_FOR_PRIVACY: 'NOT_REGISTERED_FOR_PRIVACY',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // App errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const
