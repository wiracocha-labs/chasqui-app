// ABI completo del contrato AuthorizationWithEERC20Escrow
export const AUTHORIZATION_WITH_ESCROW_ABI = [
  // Constructor
  {
    "inputs": [
      {"internalType": "address", "name": "_encryptedToken", "type": "address"},
      {"internalType": "address", "name": "_registrar", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },

  // Funciones de lectura (view)
  {
    "inputs": [],
    "name": "getTotalEscrows",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_escrowId", "type": "uint256"}],
    "name": "getEscrowDetails",
    "outputs": [
      {"internalType": "address", "name": "depositor", "type": "address"},
      {"internalType": "address", "name": "beneficiary", "type": "address"},
      {"internalType": "bytes32", "name": "encryptedAmount", "type": "bytes32"},
      {"internalType": "uint256", "name": "publicAmount", "type": "uint256"},
      {"internalType": "string", "name": "taskDescription", "type": "string"},
      {"internalType": "bool", "name": "isCompleted", "type": "bool"},
      {"internalType": "bool", "name": "isReleased", "type": "bool"},
      {"internalType": "bool", "name": "isPrivate", "type": "bool"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserEscrows",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_address", "type": "address"}],
    "name": "isAuthorized",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "isRegisteredForPrivacy",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserEncryptedBalance",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_escrowId", "type": "uint256"}],
    "name": "getTaskVerification",
    "outputs": [
      {"internalType": "bytes32", "name": "taskHash", "type": "bytes32"},
      {"internalType": "bytes", "name": "zkProof", "type": "bytes"},
      {"internalType": "address", "name": "verifier", "type": "address"},
      {"internalType": "uint256", "name": "verificationTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Funciones de escritura
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "bool", "name": "_isAuthorized", "type": "bool"}
    ],
    "name": "setUserAuthorization",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes", "name": "publicKey", "type": "bytes"},
      {"internalType": "bytes", "name": "zkProof", "type": "bytes"}
    ],
    "name": "registerForPrivacy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_beneficiary", "type": "address"},
      {"internalType": "string", "name": "_taskDescription", "type": "string"}
    ],
    "name": "createPublicEscrow",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_beneficiary", "type": "address"},
      {"internalType": "bytes32", "name": "_encryptedAmount", "type": "bytes32"},
      {"internalType": "bytes", "name": "_zkProof", "type": "bytes"},
      {"internalType": "string", "name": "_taskDescription", "type": "string"}
    ],
    "name": "createPrivateEscrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_escrowId", "type": "uint256"}],
    "name": "markTaskCompleted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_escrowId", "type": "uint256"},
      {"internalType": "bytes32", "name": "_taskHash", "type": "bytes32"},
      {"internalType": "bytes", "name": "_zkProof", "type": "bytes"}
    ],
    "name": "markTaskCompletedWithZK",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_escrowId", "type": "uint256"}],
    "name": "releaseFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_escrowId", "type": "uint256"},
      {"internalType": "bytes", "name": "_zkProof", "type": "bytes"}
    ],
    "name": "releasePrivateFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_escrowId", "type": "uint256"}],
    "name": "cancelEscrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_escrowId", "type": "uint256"},
      {"internalType": "bytes", "name": "_zkProof", "type": "bytes"}
    ],
    "name": "cancelPrivateEscrow",
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
      {"internalType": "address", "name": "_newEncryptedToken", "type": "address"},
      {"internalType": "address", "name": "_newRegistrar", "type": "address"}
    ],
    "name": "updateEERC20Contracts",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Función receive
  {
    "stateMutability": "payable",
    "type": "receive"
  },

  // Eventos
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "bool", "name": "isAuthorized", "type": "bool"}
    ],
    "name": "UserAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "escrowId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "depositor", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "beneficiary", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "encryptedAmount", "type": "bytes32"},
      {"indexed": false, "internalType": "string", "name": "taskDescription", "type": "string"},
      {"indexed": false, "internalType": "bool", "name": "isPrivate", "type": "bool"}
    ],
    "name": "EEscrowCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "escrowId", "type": "uint256"},
      {"indexed": false, "internalType": "bytes32", "name": "taskHash", "type": "bytes32"},
      {"indexed": true, "internalType": "address", "name": "verifier", "type": "address"}
    ],
    "name": "TaskCompletedWithZK",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "escrowId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "beneficiary", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "encryptedAmount", "type": "bytes32"}
    ],
    "name": "PrivateFundsReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "escrowId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "depositor", "type": "address"}
    ],
    "name": "EEscrowCanceled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "UserRegisteredForPrivacy",
    "type": "event"
  }
] as const

// ABI simplificado para funciones de string (más fácil de usar)
export const AUTHORIZATION_SIMPLE_ABI = [
  // Funciones de lectura
  "function getTotalEscrows() view returns (uint256)",
  "function getEscrowDetails(uint256) view returns (address,address,bytes32,uint256,string,bool,bool,bool,uint256)",
  "function getUserEscrows(address) view returns (uint256[])",
  "function isAuthorized(address) view returns (bool)",
  "function isRegisteredForPrivacy(address) view returns (bool)",
  "function getUserEncryptedBalance(address) view returns (bytes32)",
  "function owner() view returns (address)",
  "function getTaskVerification(uint256) view returns (bytes32,bytes,address,uint256)",
  
  // Funciones de escritura
  "function createPublicEscrow(address,string) payable",
  "function createPrivateEscrow(address,bytes32,bytes,string)",
  "function markTaskCompleted(uint256)",
  "function markTaskCompletedWithZK(uint256,bytes32,bytes)",
  "function releaseFunds(uint256)",
  "function releasePrivateFunds(uint256,bytes)",
  "function cancelEscrow(uint256)",
  "function cancelPrivateEscrow(uint256,bytes)",
  "function registerForPrivacy(bytes,bytes)",
  "function setUserAuthorization(address,bool)",
  "function withdraw()",
  
  // Eventos
  "event EEscrowCreated(uint256 indexed,address indexed,address indexed,bytes32,string,bool)",
  "event TaskCompletedWithZK(uint256 indexed,bytes32,address indexed)",
  "event PrivateFundsReleased(uint256 indexed,address indexed,bytes32)",
  "event EEscrowCanceled(uint256 indexed,address indexed)",
  "event UserAuthorized(address indexed,bool)",
  "event UserRegisteredForPrivacy(address indexed)"
] as const

// Exportar el ABI por defecto (simple)
export default AUTHORIZATION_SIMPLE_ABI
