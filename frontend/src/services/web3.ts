import { ethers } from 'ethers'
import { AUTHORIZATION_CONTRACT_ADDRESS, CONTRACT_ADDRESSES } from '../config/contracts'
import { AUTHORIZATION_SIMPLE_ABI } from '../config/abi'

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
      throw new Error('MetaMask no está instalado')
    }

    try {
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
      
      return {
        address,
        network: network.name === 'unknown' ? 'localhost' : network.name,
        balance: ethers.formatEther(balance)
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
      throw error
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
      return network.chainId === 31337n
    } catch {
      return false
    }
  }

  // FUNCIONES DE LECTURA

  async getTotalEscrows(): Promise<number> {
    if (!this.contract) throw new Error('Contrato no inicializado')
    const total = await this.contract.getTotalEscrows()
    return Number(total)
  }

  async getEscrowDetails(escrowId: number): Promise<EscrowDetails> {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    const details = await this.contract.getEscrowDetails(escrowId)
    
    return {
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
  }

  async getUserEscrows(address: string): Promise<number[]> {
    if (!this.contract) throw new Error('Contrato no inicializado')
    const escrowIds = await this.contract.getUserEscrows(address)
    return escrowIds.map((id: bigint) => Number(id))
  }

  async isAuthorized(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contrato no inicializado')
    return await this.contract.isAuthorized(address)
  }

  async isRegisteredForPrivacy(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contrato no inicializado')
    return await this.contract.isRegisteredForPrivacy(address)
  }

  // FUNCIONES DE ESCRITURA

  async createPublicEscrow(beneficiary: string, taskDescription: string, amount: string) {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    const tx = await this.contract.createPublicEscrow(
      beneficiary,
      taskDescription,
      { value: ethers.parseEther(amount) }
    )
    
    return await tx.wait()
  }

  async createPrivateEscrow(
    beneficiary: string, 
    encryptedAmount: string, 
    zkProof: string, 
    taskDescription: string
  ) {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    const tx = await this.contract.createPrivateEscrow(
      beneficiary,
      encryptedAmount,
      zkProof,
      taskDescription
    )
    
    return await tx.wait()
  }

  async markTaskCompleted(escrowId: number) {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    const tx = await this.contract.markTaskCompleted(escrowId)
    return await tx.wait()
  }

  async releaseFunds(escrowId: number) {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    const tx = await this.contract.releaseFunds(escrowId)
    return await tx.wait()
  }

  async cancelEscrow(escrowId: number) {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    const tx = await this.contract.cancelEscrow(escrowId)
    return await tx.wait()
  }

  // FUNCIONES DE UTILIDAD

  async waitForTransaction(txHash: string) {
    if (!this.provider) throw new Error('Provider no inicializado')
    return await this.provider.waitForTransaction(txHash)
  }

  // Escuchar eventos del contrato
  onEscrowCreated(callback: (escrowId: number, depositor: string, beneficiary: string) => void) {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    this.contract.on('EEscrowCreated', (escrowId, depositor, beneficiary) => {
      callback(Number(escrowId), depositor, beneficiary)
    })
  }

  onTaskCompleted(callback: (escrowId: number, verifier: string) => void) {
    if (!this.contract) throw new Error('Contrato no inicializado')
    
    this.contract.on('TaskCompletedWithZK', (escrowId, taskHash, verifier) => {
      callback(Number(escrowId), verifier)
    })
  }

  // Limpiar listeners
  removeAllListeners() {
    if (this.contract) {
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
