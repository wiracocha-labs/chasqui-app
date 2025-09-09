/**
 * Logger service for Chasqui App
 * Provides centralized logging with environment-aware output
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

import { DEBUG, ENV } from '../config'

interface LoggerConfig {
  isDev: boolean
  debug: boolean
  minLevel: LogLevel
  enableConsole: boolean
  enableStorage: boolean
}

export class Logger {
  private config: LoggerConfig

  constructor(customConfig?: Partial<LoggerConfig>) {
    // Simplified configuration with single debug flag
    this.config = {
      isDev: ENV.isDev,
      debug: DEBUG.enabled,
      minLevel: DEBUG.enabled ? LogLevel.DEBUG : (ENV.isDev ? LogLevel.INFO : LogLevel.ERROR),
      enableConsole: true,
      enableStorage: true,
      ...customConfig
    }

    // Set debug flag in localStorage for persistence
    if (DEBUG.enabled) {
      localStorage.setItem('chasqui_debug', 'true')
    }

    // Log initial configuration in debug mode
    if (this.config.debug) {
      console.log('🔧 Logger initialized with config:', {
        isDev: this.config.isDev,
        debug: this.config.debug,
        minLevel: LogLevel[this.config.minLevel],
        enableConsole: this.config.enableConsole,
        enableStorage: this.config.enableStorage
      })
    }
  }

  // Public methods to control debug mode
  enableDebug(): void {
    this.config.debug = true
    this.config.minLevel = LogLevel.DEBUG
    localStorage.setItem('chasqui_debug', 'true')
    console.log('🐛 Debug mode enabled')
  }

  disableDebug(): void {
    this.config.debug = false
    this.config.minLevel = this.config.isDev ? LogLevel.INFO : LogLevel.ERROR
    localStorage.removeItem('chasqui_debug')
    console.log('🔇 Debug mode disabled')
  }

  isDebugEnabled(): boolean {
    return this.config.debug
  }

  // Get current configuration
  getConfig(): LoggerConfig {
    return { ...this.config }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel && this.config.enableConsole
  }

  private formatMessage(level: string, context: string, message: string): string {
    const timestamp = new Date().toISOString().slice(11, 23) // HH:mm:ss.SSS
    const emoji = this.getLogEmoji(level)
    return `${emoji} [${timestamp}] ${level} [${context}] ${message}`
  }

  private getLogEmoji(level: string): string {
    switch (level) {
      case 'DEBUG': return '🐛'
      case 'INFO': return 'ℹ️'
      case 'WARN': return '⚠️'
      case 'ERROR': return '❌'
      default: return '📝'
    }
  }

  debug(context: string, message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', context, message), ...args)
    }
  }

  info(context: string, message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', context, message), ...args)
    }
  }

  warn(context: string, message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', context, message), ...args)
    }
  }

  error(context: string, message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', context, message), error)
      
      // En producción, aquí enviarías a un servicio de logging
      if (!this.config.isDev && error && this.config.enableStorage) {
        this.reportError(context, message, error)
      }
    }
  }

  private reportError(context: string, message: string, error: any): void {
    // TODO: Integrar con servicio de error tracking (Sentry, LogRocket, etc.)
    // Por ahora, solo almacenar localmente para desarrollo
    const errorReport = {
      timestamp: new Date().toISOString(),
      context,
      message,
      error: error?.message || error,
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    try {
      const errors = JSON.parse(localStorage.getItem('chasqui_errors') || '[]')
      errors.push(errorReport)
      // Mantener solo los últimos 50 errores
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50)
      }
      localStorage.setItem('chasqui_errors', JSON.stringify(errors))
    } catch (e) {
      // Si localStorage falla, no hacer nada
    }
  }

  // Método para obtener errores almacenados (útil para debugging)
  getStoredErrors(): any[] {
    try {
      return JSON.parse(localStorage.getItem('chasqui_errors') || '[]')
    } catch {
      return []
    }
  }

  // Método para limpiar errores almacenados
  clearStoredErrors(): void {
    localStorage.removeItem('chasqui_errors')
  }
}

// Singleton instance
export const logger = new Logger()

// Convenience functions for quick access
export const log = {
  debug: (context: string, message: string, ...args: any[]) => logger.debug(context, message, ...args),
  info: (context: string, message: string, ...args: any[]) => logger.info(context, message, ...args),
  warn: (context: string, message: string, ...args: any[]) => logger.warn(context, message, ...args),
  error: (context: string, message: string, error?: any) => logger.error(context, message, error),
  
  // Debug control functions
  enableDebug: () => logger.enableDebug(),
  disableDebug: () => logger.disableDebug(),
  isDebugEnabled: () => logger.isDebugEnabled(),
  getConfig: () => logger.getConfig(),
  
  // Utility functions
  getStoredErrors: () => logger.getStoredErrors(),
  clearStoredErrors: () => logger.clearStoredErrors()
}

// Make logger available globally in development for debugging
if (typeof window !== 'undefined' && logger.isDebugEnabled()) {
  (window as any).chasquiLogger = log
  console.log('🔧 Global logger available as window.chasquiLogger')
}
