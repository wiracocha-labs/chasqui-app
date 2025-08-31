import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { ethers } from 'ethers'
import { getContractAddress, AUTHORIZATION_CONTRACT_ADDRESS } from '../config/contracts'
import { AUTHORIZATION_SIMPLE_ABI } from '../config/abi'

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
    console.log('🚀 initializeProvider called')
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Create a simple provider for basic operations
        console.log('🔄 Creating BrowserProvider for basic operations')
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        provider.value = web3Provider
        
        console.log('✅ Provider initialized')
        
        // Check for connected wallet on load
        await checkConnectedWallet()

        // Listen for account changes (only add listener once)
        if (!window.ethereum._listenersAdded) {
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            console.log('🔄 Account changed:', accounts)
            address.value = accounts[0] || null
          })
          window.ethereum._listenersAdded = true
        }
      } catch (error) {
        console.error('❌ Error initializing provider:', error)
        // Even if provider creation fails, we can still check for connected wallets
        await checkConnectedWallet()
      }
    } else {
      console.log('❌ No window.ethereum found')
    }
  }

  const checkConnectedWallet = async () => {
    console.log('🔍 checkConnectedWallet called')
    if (!window.ethereum) {
      console.log('❌ No window.ethereum')
      return
    }
    
    try {
      console.log('📞 Requesting eth_accounts')
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      console.log('📍 Accounts found:', accounts)
      
      if (accounts.length > 0) {
        address.value = accounts[0]
        console.log('✅ Address set to:', address.value)
      } else {
        console.log('❌ No accounts found')
      }
    } catch (error) {
      console.error('❌ Error checking connected wallet:', error)
    }
  }

  const connectWallet = async () => {
    console.log('🚀 authStore.connectWallet called')
    
    if (!window.ethereum) {
      console.log('❌ No MetaMask')
      alert('Por favor instala MetaMask!')
      return
    }

    try {
      // First, try to switch to Hardhat network
      console.log('🔄 Switching to Hardhat network')
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7a69' }], // 31337 in hex
        })
        console.log('✅ Switched to Hardhat network')
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          console.log('📡 Adding Hardhat network')
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
            console.log('✅ Added and switched to Hardhat network')
          } catch (addError) {
            console.error('❌ Error adding Hardhat network:', addError)
            alert('Por favor agrega y cambia a la red local de Hardhat manualmente en MetaMask')
            return
          }
        } else {
          console.error('❌ Error switching to Hardhat network:', switchError)
          alert('Por favor cambia a la red local de Hardhat (Chain ID: 31337) en MetaMask')
          return
        }
      }

      // Now connect the wallet
      console.log('📞 Requesting account access')
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      console.log('📍 Accounts received:', accounts)
      address.value = accounts[0]
      console.log('✅ Address set to:', address.value)
      
      // Update provider and contract for future transactions
      console.log('🔄 Updating provider')
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      provider.value = web3Provider
      
      // Test the provider immediately
      try {
        const network = await web3Provider.getNetwork()
        console.log('✅ Provider working, network:', network.name, 'chainId:', network.chainId.toString())
      } catch (providerError) {
        console.error('❌ Provider test failed:', providerError)
      }
      
      console.log('✅ Provider updated after wallet connection')
      
    } catch (error) {
      console.error('❌ Error al conectar la wallet:', error)
      throw error
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
      
      console.log('💰 Balance updated:', finalBalance, 'ETH')
      return finalBalance
    } catch (error) {
      console.error('Error with BrowserProvider, trying direct RPC:', error)
      
      // Try using the web3 provider directly via window.ethereum
      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address.value, 'latest']
        })
        
        const balanceWei = BigInt(balanceHex)
        const formattedBalance = ethers.formatEther(balanceWei)
        const finalBalance = parseFloat(formattedBalance).toFixed(4)
        
        console.log('💰 Balance via direct RPC:', finalBalance, 'ETH')
        return finalBalance
      } catch (rpcError) {
        console.error('Error getting balance:', rpcError)
        return '0.00'
      }
    }
  }

  const checkAuthorization = async (userAddress: string): Promise<boolean> => {
    if (!window.ethereum) {
      console.warn('MetaMask not available')
      return false
    }

    try {
      console.log('Checking authorization for:', userAddress)
      console.log('Contract address:', AUTHORIZATION_CONTRACT_ADDRESS)
      
      // Create a fresh provider for this operation
      const freshProvider = new ethers.BrowserProvider(window.ethereum)
      
      // Check network info
      try {
        const network = await freshProvider.getNetwork()
        console.log('Connected to network:', network.name, 'Chain ID:', network.chainId.toString())
        
        if (network.chainId !== 31337n) {
          console.warn('⚠️  Not connected to Hardhat local network (31337). Current chain:', network.chainId.toString())
        }
      } catch (networkError) {
        console.warn('Could not get network info, proceeding anyway:', networkError)
      }
      
      // Verify the contract exists at this address
      const code = await freshProvider.getCode(AUTHORIZATION_CONTRACT_ADDRESS)
      if (code === '0x') {
        console.error('No contract found at address:', AUTHORIZATION_CONTRACT_ADDRESS)
        return false
      }
      
      console.log('Contract code found, calling isAuthorized...')
      
      // Create a readonly contract instance
      const readOnlyContract = new ethers.Contract(
        AUTHORIZATION_CONTRACT_ADDRESS,
        AUTHORIZATION_SIMPLE_ABI,
        freshProvider
      )
      
      const isAuthorized = await readOnlyContract.isAuthorized(userAddress)
      console.log('Authorization result:', isAuthorized)
      return isAuthorized
    } catch (error) {
      console.error('Error al verificar autorización:', error)
      console.error('Contract address used:', AUTHORIZATION_CONTRACT_ADDRESS)
      console.error('User address:', userAddress)
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
