/**
 * Configuration utilities for Chasqui App
 * Centralized configuration management
 */

// Environment detection
export const ENV = {
  isDev: import.meta.env.DEV || window.location.hostname === 'localhost',
  isProd: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test'
} as const

// Debug configuration - Single source of truth
export const DEBUG = {
  // Single debug flag from multiple sources
  enabled: import.meta.env.VITE_DEBUG === 'true' || 
           localStorage.getItem('chasqui_debug') === 'true' ||
           new URLSearchParams(window.location.search).get('debug') === 'true'
} as const

// Network configuration
export const NETWORKS = {
  localhost: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: null,
    currency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  fuji: {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    blockExplorer: 'https://testnet.snowtrace.io',
    currency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    }
  },
  avalanche: {
    chainId: 43114,
    name: 'Avalanche Mainnet',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    currency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    }
  }
} as const

// Current network (can be overridden by environment variable)
export const CURRENT_NETWORK = (import.meta.env.VITE_NETWORK as keyof typeof NETWORKS) || 'localhost'

// Contract addresses configuration
export const CONTRACT_CONFIG = {
  [NETWORKS.localhost.chainId]: {
    authorization: import.meta.env.VITE_LOCALHOST_AUTH_CONTRACT || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    eerc20: import.meta.env.VITE_LOCALHOST_EERC20_CONTRACT || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    registrar: import.meta.env.VITE_LOCALHOST_REGISTRAR_CONTRACT || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  },
  [NETWORKS.fuji.chainId]: {
    authorization: import.meta.env.VITE_FUJI_AUTH_CONTRACT || '',
    eerc20: import.meta.env.VITE_FUJI_EERC20_CONTRACT || '',
    registrar: import.meta.env.VITE_FUJI_REGISTRAR_CONTRACT || ''
  },
  [NETWORKS.avalanche.chainId]: {
    authorization: import.meta.env.VITE_AVALANCHE_AUTH_CONTRACT || '',
    eerc20: import.meta.env.VITE_AVALANCHE_EERC20_CONTRACT || '',
    registrar: import.meta.env.VITE_AVALANCHE_REGISTRAR_CONTRACT || ''
  }
} as const

// Application configuration
export const APP_CONFIG = {
  name: 'Chasqui',
  version: '1.0.0',
  description: 'Decentralized task management with private payments',
  
  // UI configuration
  ui: {
    showNetworkIndicator: true,
    autoConnectWallet: ENV.isDev,
    enableAnimations: true,
    theme: 'dark' // 'light' | 'dark' | 'auto'
  },
  
  // Feature flags
  features: {
    privateEscrow: true,
    publicEscrow: true,
    webhooks: ENV.isDev, // Only in development for now
    analytics: ENV.isProd,
    errorReporting: ENV.isProd
  },
  
  // Timeouts and intervals (in milliseconds)
  timeouts: {
    walletConnection: 30000,
    transactionConfirmation: 60000,
    balanceUpdate: 10000
  }
} as const

// Utility functions
export function getCurrentNetworkConfig() {
  return NETWORKS[CURRENT_NETWORK]
}

export function getContractAddress(contractName: keyof typeof CONTRACT_CONFIG[43113], chainId?: number) {
  const targetChainId = chainId || getCurrentNetworkConfig().chainId
  const contractConfig = CONTRACT_CONFIG[targetChainId as keyof typeof CONTRACT_CONFIG]
  
  if (!contractConfig) {
    throw new Error(`No contract configuration found for chain ID ${targetChainId}`)
  }
  
  const address = contractConfig[contractName]
  if (!address) {
    throw new Error(`No ${contractName} contract address configured for chain ID ${targetChainId}`)
  }
  
  return address
}

export function isFeatureEnabled(feature: keyof typeof APP_CONFIG.features): boolean {
  return APP_CONFIG.features[feature]
}

export function getDebugFlags() {
  return DEBUG
}

// Development utilities
export function enableDebug() {
  localStorage.setItem('chasqui_debug', 'true')
  console.log('🐛 Debug enabled globally')
}

export function disableDebug() {
  localStorage.removeItem('chasqui_debug')
  console.log('🔇 Debug disabled globally')
}

// Make configuration available globally in development
if (typeof window !== 'undefined' && ENV.isDev) {
  (window as any).chasquiConfig = {
    ENV,
    DEBUG,
    NETWORKS,
    CURRENT_NETWORK,
    CONTRACT_CONFIG,
    APP_CONFIG,
    getCurrentNetworkConfig,
    getContractAddress,
    isFeatureEnabled,
    getDebugFlags,
    enableDebug,
    disableDebug
  }
  console.log('🔧 Global config available as window.chasquiConfig')
}
