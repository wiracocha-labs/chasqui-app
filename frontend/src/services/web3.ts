import { ethers } from 'ethers'
import { AUTHORIZATION_CONTRACT_ADDRESS, CONTRACT_ADDRESSES } from '../config/contracts'
import { AUTHORIZATION_SIMPLE_ABI } from '../config/abi'
import { log } from './logger'
import { Web3Error, handleError } from './errors'

export interface EscrowDetails {
  id: number
  depositor: string
  beneficiary: string
  encryptedAmount: string
  publicAmount: string
  taskDescription: string
  isCompleted: boolean
  isReleased: boolean
  isPrivate: boolean
  timestamp: number
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private contract: ethers.Contract | null = null
  private readonly contractAddress: string

  constructor() {
    this.contractAddress = AUTHORIZATION_CONTRACT_ADDRESS
  }

  // Inicializar conexión con MetaMask
  async connect(): Promise<{ address: string; network: string; balance: string }> {
    if (!window.ethereum) {
      throw Web3Error.connectionFailed(new Error('MetaMask not installed'))
    }

    try {
      log.debug('Web3Service', 'Starting connection to MetaMask')
      this.provider = new ethers.BrowserProvider(window.ethereum)
      
      // Solicitar acceso a las cuentas
      await this.provider.send("eth_requestAccounts", [])
      
      this.signer = await this.provider.getSigner()
      const address = await this.signer.getAddress()
      
      // Obtener información de la red
      const network = await this.provider.getNetwork()
      const balance = await this.provider.getBalance(address)
      
      // Inicializar contrato
      this.contract = new ethers.Contract(this.contractAddress, AUTHORIZATION_SIMPLE_ABI, this.signer)
      
      const result = {
        address,
        network: network.name === 'unknown' ? 'localhost' : network.name,
        balance: ethers.formatEther(balance)
      }
      
      log.info('Web3Service', `Connected successfully to ${result.network} with address ${result.address}`)
      return result
    } catch (error) {
      const web3Error = handleError(error, 'Web3Service')
      log.error('Web3Service', 'Connection failed', web3Error)
      throw web3Error
    }
  }

  // Verificar si está conectado
  isConnected(): boolean {
    return this.provider !== null && this.signer !== null && this.contract !== null
  }

  // Obtener dirección actual
  async getCurrentAddress(): Promise<string | null> {
    if (!this.signer) return null
    try {
      return await this.signer.getAddress()
    } catch {
      return null
    }
  }

  // Verificar si está en la red correcta (localhost:31337)
  async checkNetwork(): Promise<boolean> {
    if (!this.provider) return false
    try {
      const network = await this.provider.getNetwork()
      const isCorrectNetwork = network.chainId === 31337n
      log.debug('Web3Service', `Network check: ${network.chainId} === 31337? ${isCorrectNetwork}`)
      return isCorrectNetwork
    } catch (error) {
      log.error('Web3Service', 'Error checking network', error)
      return false
    }
  }

  // FUNCIONES DE LECTURA

  async getTotalEscrows(): Promise<number> {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      const total = await this.contract.getTotalEscrows()
      const result = Number(total)
      log.debug('Web3Service', `Total escrows: ${result}`)
      return result
    } catch (error) {
      throw Web3Error.transactionFailed('Failed to get total escrows', error)
    }
  }

  async getEscrowDetails(escrowId: number): Promise<EscrowDetails> {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.debug('Web3Service', `Getting escrow details for ID: ${escrowId}`)
      const details = await this.contract.getEscrowDetails(escrowId)
      
      const result = {
        id: escrowId,
        depositor: details[0],
        beneficiary: details[1],
        encryptedAmount: details[2],
        publicAmount: ethers.formatEther(details[3]),
        taskDescription: details[4],
        isCompleted: details[5],
        isReleased: details[6],
        isPrivate: details[7],
        timestamp: Number(details[8])
      }
      
      log.debug('Web3Service', `Escrow details retrieved for ID ${escrowId}`)
      return result
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to get escrow details for ID ${escrowId}`, error)
    }
  }

  async getUserEscrows(address: string): Promise<number[]> {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.debug('Web3Service', `Getting escrows for address: ${address}`)
      const escrowIds = await this.contract.getUserEscrows(address)
      const result = escrowIds.map((id: bigint) => Number(id))
      log.debug('Web3Service', `Found ${result.length} escrows for ${address}`)
      return result
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to get escrows for address ${address}`, error)
    }
  }

  async isAuthorized(address: string): Promise<boolean> {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.debug('Web3Service', `Checking authorization for: ${address}`)
      const result = await this.contract.isAuthorized(address)
      log.debug('Web3Service', `Authorization status for ${address}: ${result}`)
      return result
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to check authorization for ${address}`, error)
    }
  }

  async isRegisteredForPrivacy(address: string): Promise<boolean> {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.debug('Web3Service', `Checking privacy registration for: ${address}`)
      const result = await this.contract.isRegisteredForPrivacy(address)
      log.debug('Web3Service', `Privacy registration for ${address}: ${result}`)
      return result
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to check privacy registration for ${address}`, error)
    }
  }

  // FUNCIONES DE ESCRITURA

  async createPublicEscrow(beneficiary: string, taskDescription: string, amount: string) {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.info('Web3Service', `Creating public escrow: ${taskDescription} for ${amount} AVAX`)
      const tx = await this.contract.createPublicEscrow(
        beneficiary,
        taskDescription,
        { value: ethers.parseEther(amount) }
      )
      
      log.debug('Web3Service', `Public escrow transaction: ${tx.hash}`)
      const receipt = await tx.wait()
      log.info('Web3Service', `Public escrow created in block: ${receipt.blockNumber}`)
      return receipt
    } catch (error) {
      throw Web3Error.transactionFailed('Failed to create public escrow', error)
    }
  }

  async createPrivateEscrow(
    beneficiary: string, 
    encryptedAmount: string, 
    zkProof: string, 
    taskDescription: string
  ) {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.info('Web3Service', `Creating private escrow: ${taskDescription}`)
      const tx = await this.contract.createPrivateEscrow(
        beneficiary,
        encryptedAmount,
        zkProof,
        taskDescription
      )
      
      log.debug('Web3Service', `Private escrow transaction: ${tx.hash}`)
      const receipt = await tx.wait()
      log.info('Web3Service', `Private escrow created in block: ${receipt.blockNumber}`)
      return receipt
    } catch (error) {
      throw Web3Error.transactionFailed('Failed to create private escrow', error)
    }
  }

  async markTaskCompleted(escrowId: number) {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.info('Web3Service', `Marking task completed for escrow: ${escrowId}`)
      const tx = await this.contract.markTaskCompleted(escrowId)
      log.debug('Web3Service', `Task completion transaction: ${tx.hash}`)
      const receipt = await tx.wait()
      log.info('Web3Service', `Task marked completed in block: ${receipt.blockNumber}`)
      return receipt
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to mark task ${escrowId} as completed`, error)
    }
  }

  async releaseFunds(escrowId: number) {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.info('Web3Service', `Releasing funds for escrow: ${escrowId}`)
      const tx = await this.contract.releaseFunds(escrowId)
      log.debug('Web3Service', `Funds release transaction: ${tx.hash}`)
      const receipt = await tx.wait()
      log.info('Web3Service', `Funds released in block: ${receipt.blockNumber}`)
      return receipt
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to release funds for escrow ${escrowId}`, error)
    }
  }

  async cancelEscrow(escrowId: number) {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    try {
      log.warn('Web3Service', `Canceling escrow: ${escrowId}`)
      const tx = await this.contract.cancelEscrow(escrowId)
      log.debug('Web3Service', `Escrow cancellation transaction: ${tx.hash}`)
      const receipt = await tx.wait()
      log.info('Web3Service', `Escrow canceled in block: ${receipt.blockNumber}`)
      return receipt
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to cancel escrow ${escrowId}`, error)
    }
  }

  // FUNCIONES DE UTILIDAD

  async waitForTransaction(txHash: string) {
    if (!this.provider) {
      throw Web3Error.walletNotConnected()
    }
    
    try {
      log.debug('Web3Service', `Waiting for transaction: ${txHash}`)
      const receipt = await this.provider.waitForTransaction(txHash)
      log.info('Web3Service', `Transaction confirmed: ${txHash}`)
      return receipt
    } catch (error) {
      throw Web3Error.transactionFailed(`Failed to wait for transaction ${txHash}`, error)
    }
  }

  // Escuchar eventos del contrato
  onEscrowCreated(callback: (escrowId: number, depositor: string, beneficiary: string) => void) {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    log.debug('Web3Service', 'Setting up EEscrowCreated event listener')
    this.contract.on('EEscrowCreated', (escrowId, depositor, beneficiary) => {
      log.info('Web3Service', `Escrow created: ID ${Number(escrowId)}, Depositor: ${depositor}`)
      callback(Number(escrowId), depositor, beneficiary)
    })
  }

  onTaskCompleted(callback: (escrowId: number, verifier: string) => void) {
    if (!this.contract) {
      throw Web3Error.contractNotFound(this.contractAddress)
    }
    
    log.debug('Web3Service', 'Setting up TaskCompletedWithZK event listener')
    this.contract.on('TaskCompletedWithZK', (escrowId, taskHash, verifier) => {
      log.info('Web3Service', `Task completed: Escrow ${Number(escrowId)}, Verifier: ${verifier}`)
      callback(Number(escrowId), verifier)
    })
  }

  // Limpiar listeners
  removeAllListeners() {
    if (this.contract) {
      log.debug('Web3Service', 'Removing all contract event listeners')
      this.contract.removeAllListeners()
    }
  }
}

// Instancia singleton
export const web3Service = new Web3Service()

// Declaraciones de tipos para window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
