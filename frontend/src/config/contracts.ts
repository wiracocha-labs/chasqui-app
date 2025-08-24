// Auto-generated from deploy script
export const CONTRACT_ADDRESSES = {
  31337: {
    authorization: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    mockToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    mockRegistrar: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  }
} as const;

export const getContractAddress = (chainId: number, contractName: string) => {
  const networkAddresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!networkAddresses) {
    throw new Error(`No contract addresses configured for chain ID ${chainId}`);
  }
  return networkAddresses[contractName as keyof typeof networkAddresses];
};

export const AUTHORIZATION_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[31337].authorization;
