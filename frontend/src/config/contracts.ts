export const CONTRACT_ADDRESSES = {
  31337: {
    // Hardhat local defaults after running deploy-local.ts
    authorization: import.meta.env.VITE_LOCALHOST_AUTH_CONTRACT || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    mockToken: import.meta.env.VITE_LOCALHOST_EERC20_CONTRACT || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    mockRegistrar: import.meta.env.VITE_LOCALHOST_REGISTRAR_CONTRACT || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  },
  43113: {
    // Fuji testnet deployment
    authorization: import.meta.env.VITE_FUJI_AUTH_CONTRACT || "0xD6a54132db9c9a8e16B7d373F19d1bb1F46f40d2",
    mockToken: import.meta.env.VITE_FUJI_EERC20_CONTRACT || "0xcFAc52a2acd4663C09a15f8375b9e5E053E6c059",
    mockRegistrar: import.meta.env.VITE_FUJI_REGISTRAR_CONTRACT || "0x3BfB821bdA7526361a155A09eDd225873eC64619"
  }
} as const

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES
export type ContractName = keyof typeof CONTRACT_ADDRESSES[31337]

export const getContractAddress = (chainId: number, contractName: ContractName) => {
  const networkAddresses = CONTRACT_ADDRESSES[chainId as SupportedChainId]
  if (!networkAddresses) {
    throw new Error(`No contract addresses configured for chain ID ${chainId}`)
  }

  const address = networkAddresses[contractName]
  if (!address) {
    throw new Error(`No ${contractName} address configured for chain ID ${chainId}`)
  }

  return address
}

export const AUTHORIZATION_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[31337].authorization
