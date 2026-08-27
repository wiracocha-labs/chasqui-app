/**
 * Logger Test Utility
 * Used to verify logging behavior in different environments
 */

import { log, LogLevel } from '../services/logger'

export function testLoggerBehavior() {
  console.log('=== Testing Logger Behavior ===')
  
  // Test all log levels
  log.debug('Test', 'This is a debug message')
  log.info('Test', 'This is an info message')
  log.warn('Test', 'This is a warning message')
  log.error('Test', 'This is an error message', { test: true })
  
  // Test debug control
  console.log('Debug enabled:', log.isDebugEnabled())
  console.log('Logger config:', log.getConfig())
  
  // Test enabling/disabling debug
  if (log.isDebugEnabled()) {
    log.disableDebug()
    console.log('Debug disabled - testing info level:')
    log.info('Test', 'This should still show (info level)')
    log.debug('Test', 'This should NOT show (debug level)')
    
    log.enableDebug()
    console.log('Debug re-enabled - testing debug level:')
    log.debug('Test', 'This should show again (debug level)')
  }
  
  console.log('=== Logger Test Complete ===')
}

// Make available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testLogger = testLoggerBehavior
}
