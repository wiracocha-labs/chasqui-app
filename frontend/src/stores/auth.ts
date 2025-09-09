import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { ethers } from 'ethers'
import { getContractAddress, AUTHORIZATION_CONTRACT_ADDRESS } from '../config/contracts'
import { AUTHORIZATION_SIMPLE_ABI } from '../config/abi'
import { log } from '../services/logger'
import { Web3Error, AuthError, handleError } from '../services/errors'

declare global {
  interface Window {
    ethereum?: any
  }
}

export const useAuthStore = defineStore('auth', () => {
  const address = ref<string | null>(null)
  const provider = ref<ethers.BrowserProvider | null>(null)
  const contract = ref<ethers.Contract | null>(null)

  const isAuthenticated = computed(() => !!address.value)

  // Initialize provider and contract
  const initializeProvider = async () => {
    log.debug('AuthStore', 'Initializing provider')
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Create a simple provider for basic operations
        log.debug('AuthStore', 'Creating BrowserProvider for basic operations')
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        provider.value = web3Provider
        
        log.info('AuthStore', 'Provider initialized successfully')
        
        // Check for connected wallet on load
        await checkConnectedWallet()

        // Listen for account changes (only add listener once)
        if (!window.ethereum._listenersAdded) {
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            log.debug('AuthStore', 'Account changed', accounts)
            address.value = accounts[0] || null
          })
          window.ethereum._listenersAdded = true
        }
      } catch (error) {
        log.error('AuthStore', 'Error initializing provider', error)
        // Even if provider creation fails, we can still check for connected wallets
        await checkConnectedWallet()
      }
    } else {
      log.warn('AuthStore', 'No window.ethereum found')
    }
  }

  const checkConnectedWallet = async () => {
    log.debug('AuthStore', 'Checking connected wallet')
    if (!window.ethereum) {
      log.warn('AuthStore', 'No window.ethereum available')
      return
    }
    
    try {
      log.debug('AuthStore', 'Requesting eth_accounts')
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      log.debug('AuthStore', 'Accounts found', accounts)
      
      if (accounts.length > 0) {
        address.value = accounts[0]
        log.info('AuthStore', `Connected wallet found: ${address.value}`)
      } else {
        log.debug('AuthStore', 'No connected accounts found')
      }
    } catch (error) {
      log.error('AuthStore', 'Error checking connected wallet', error)
    }
  }

  const connectWallet = async () => {
    log.info('AuthStore', 'Starting wallet connection')
    
    if (!window.ethereum) {
      throw AuthError.metaMaskNotFound()
    }

    try {
      // First, try to switch to Hardhat network
      log.debug('AuthStore', 'Switching to Hardhat network')
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7a69' }], // 31337 in hex
        })
        log.info('AuthStore', 'Successfully switched to Hardhat network')
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          log.debug('AuthStore', 'Adding Hardhat network')
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7a69', // 31337 in hex
                chainName: 'Hardhat Local',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['http://127.0.0.1:8545'],
                blockExplorerUrls: null,
              }],
            })
            log.info('AuthStore', 'Successfully added and switched to Hardhat network')
          } catch (addError) {
            throw Web3Error.wrongNetwork('Hardhat Local', 'Unknown')
          }
        } else {
          throw Web3Error.wrongNetwork('Hardhat Local (31337)', 'Unknown')
        }
      }

      // Now connect the wallet
      log.debug('AuthStore', 'Requesting account access')
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (!accounts || accounts.length === 0) {
        throw Web3Error.connectionFailed()
      }
      
      address.value = accounts[0]
      log.info('AuthStore', `Wallet connected successfully: ${address.value}`)
      
      // Update provider and contract for future transactions
      log.debug('AuthStore', 'Updating provider')
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      provider.value = web3Provider
      
      // Test the provider immediately
      try {
        const network = await web3Provider.getNetwork()
        log.info('AuthStore', `Provider working, network: ${network.name}, chainId: ${network.chainId.toString()}`)
      } catch (providerError) {
        log.error('AuthStore', 'Provider test failed', providerError)
      }
      
    } catch (error) {
      const chasquiError = handleError(error, 'AuthStore')
      log.error('AuthStore', 'Error connecting wallet', chasquiError)
      throw chasquiError
    }
  }

  const disconnect = () => {
    address.value = null
  }

  const getBalance = async (): Promise<string> => {
    if (!address.value) {
      return '0.00'
    }

    if (!window.ethereum) {
      return '0.00'
    }

    try {
      // Always create a fresh provider for balance queries
      const freshProvider = new ethers.BrowserProvider(window.ethereum)
      const balance = await freshProvider.getBalance(address.value)
      const formattedBalance = ethers.formatEther(balance)
      const finalBalance = parseFloat(formattedBalance).toFixed(4)
      
      log.debug('AuthStore', `Balance updated: ${finalBalance} ETH`)
      return finalBalance
    } catch (error) {
      log.warn('AuthStore', 'Error with BrowserProvider, trying direct RPC', error)
      
      // Try using the web3 provider directly via window.ethereum
      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address.value, 'latest']
        })
        
        const balanceWei = BigInt(balanceHex)
        const formattedBalance = ethers.formatEther(balanceWei)
        const finalBalance = parseFloat(formattedBalance).toFixed(4)
        
        log.debug('AuthStore', `Balance via direct RPC: ${finalBalance} ETH`)
        return finalBalance
      } catch (rpcError) {
        log.error('AuthStore', 'Error getting balance', rpcError)
        return '0.00'
      }
    }
  }

  const checkAuthorization = async (userAddress: string): Promise<boolean> => {
    if (!window.ethereum) {
      log.warn('AuthStore', 'MetaMask not available for authorization check')
      return false
    }

    try {
      log.debug('AuthStore', `Checking authorization for: ${userAddress}`)
      log.debug('AuthStore', `Contract address: ${AUTHORIZATION_CONTRACT_ADDRESS}`)
      
      // Create a fresh provider for this operation
      const freshProvider = new ethers.BrowserProvider(window.ethereum)
      
      // Check network info
      try {
        const network = await freshProvider.getNetwork()
        log.debug('AuthStore', `Connected to network: ${network.name}, Chain ID: ${network.chainId.toString()}`)
        
        if (network.chainId !== 31337n) {
          log.warn('AuthStore', `Not connected to Hardhat local network (31337). Current chain: ${network.chainId.toString()}`)
        }
      } catch (networkError) {
        log.warn('AuthStore', 'Could not get network info, proceeding anyway', networkError)
      }
      
      // Verify the contract exists at this address
      const code = await freshProvider.getCode(AUTHORIZATION_CONTRACT_ADDRESS)
      if (code === '0x') {
        throw Web3Error.contractNotFound(AUTHORIZATION_CONTRACT_ADDRESS)
      }
      
      log.debug('AuthStore', 'Contract code found, calling isAuthorized...')
      
      // Create a readonly contract instance
      const readOnlyContract = new ethers.Contract(
        AUTHORIZATION_CONTRACT_ADDRESS,
        AUTHORIZATION_SIMPLE_ABI,
        freshProvider
      )
      
      const isAuthorized = await readOnlyContract.isAuthorized(userAddress)
      log.info('AuthStore', `Authorization result for ${userAddress}: ${isAuthorized}`)
      return isAuthorized
    } catch (error) {
      const chasquiError = handleError(error, 'AuthStore')
      log.error('AuthStore', 'Error checking authorization', chasquiError)
      return false
    }
  }

  return {
    address,
    provider,
    isAuthenticated,
    initializeProvider,
    connectWallet,
    disconnect,
    checkAuthorization,
    getBalance,
  }
}, 
{
  persist: true
})
