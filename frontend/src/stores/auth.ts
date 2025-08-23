import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { ethers } from 'ethers'
import { getContractAddress, AUTHORIZATION_CONTRACT_ADDRESS } from '../config/contracts'

declare global {
  interface Window {
    ethereum?: any
  }
}

// ABI for the Authorization contract
const AUTH_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_isAuthorized",
        "type": "bool"
      }
    ],
    "name": "setUserAuthorization",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "isAuthorized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "authorizedUsers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isAuthorized",
        "type": "bool"
      }
    ],
    "name": "UserAuthorized",
    "type": "event"
  }
]

export const useAuthStore = defineStore('auth', () => {
  const address = ref<string | null>(null)
  const provider = ref<ethers.BrowserProvider | null>(null)
  const contract = ref<ethers.Contract | null>(null)

  const isAuthenticated = computed(() => !!address.value)

  // Initialize provider and contract
  const initializeProvider = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Just create a basic provider initially, don't try to get network info yet
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        provider.value = web3Provider
        
        console.log('Provider initialized')
        
        // Check for connected wallet on load
        checkConnectedWallet()

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          address.value = accounts[0] || null
        })
      } catch (error) {
        console.error('Error initializing provider:', error)
      }
    }
  }

  const checkConnectedWallet = async () => {
    if (!window.ethereum) return
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        address.value = accounts[0]
      }
    } catch (error) {
      console.error('Error checking connected wallet:', error)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Por favor instala MetaMask!')
      return
    }

    try {
      // First, try to switch to Hardhat network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7a69' }], // 31337 in hex
        })
        console.log('Switched to Hardhat network')
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
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
            console.log('Added and switched to Hardhat network')
          } catch (addError) {
            console.error('Error adding Hardhat network:', addError)
            alert('Por favor agrega y cambia a la red local de Hardhat manualmente en MetaMask')
            return
          }
        } else {
          console.error('Error switching to Hardhat network:', switchError)
          alert('Por favor cambia a la red local de Hardhat (Chain ID: 31337) en MetaMask')
          return
        }
      }

      // Now connect the wallet
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      address.value = accounts[0]
      
      console.log('Wallet connected:', accounts[0])
      
      // Update provider and contract for future transactions
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      provider.value = web3Provider
      
      // We'll create the signer when needed, not immediately
      console.log('Provider updated after wallet connection')
      
    } catch (error) {
      console.error('Error al conectar la wallet:', error)
      throw error
    }
  }

  const disconnect = () => {
    address.value = null
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
        AUTH_CONTRACT_ABI,
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
    address: readonly(address),
    isAuthenticated,
    initializeProvider,
    connectWallet,
    disconnect,
    checkAuthorization,
  }
})
