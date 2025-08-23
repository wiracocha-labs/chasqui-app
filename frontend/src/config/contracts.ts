// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Local Hardhat network
  31337: {
    authorization: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
  // Add other networks as needed
  // 1: { // Ethereum mainnet
  //   authorization: "",
  // },
  // 11155111: { // Sepolia testnet
  //   authorization: "",
  // },
} as const;

// Helper function to get contract address for current network
export const getContractAddress = (chainId: number, contractName: keyof typeof CONTRACT_ADDRESSES[31337]) => {
  const networkAddresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!networkAddresses) {
    throw new Error(`No contract addresses configured for chain ID ${chainId}`);
  }
  return networkAddresses[contractName];
};

// For backward compatibility - defaults to local hardhat network
export const AUTHORIZATION_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[31337].authorization;
