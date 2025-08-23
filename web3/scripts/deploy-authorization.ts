// We import the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
import hre from "hardhat";
import fs from "fs";
import path from "path";
const { ethers } = hre;

export {}; // Esto convierte el archivo en un módulo

async function updateFrontendConfig(contractAddress: string, networkId: number) {
  const configPath = path.join(__dirname, '../../frontend/src/config/contracts.ts');
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Update the authorization address for the specified network
    const regex = new RegExp(`(${networkId}:\\s*{[^}]*authorization:\\s*")[^"]*(")`);
    
    if (content.match(regex)) {
      content = content.replace(regex, `$1${contractAddress}$2`);
      fs.writeFileSync(configPath, content);
      console.log(`✅ Updated frontend config with contract address: ${contractAddress}`);
    } else {
      console.log(`⚠️  Could not auto-update frontend config for network ${networkId}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not update frontend config: ${error}`);
  }
}

async function main(): Promise<string> {
  // Get the contract factory with type
  const AuthorizationFactory = await ethers.getContractFactory("Authorization");
  
  // Deploy the contract
  console.log("Deploying Authorization contract...");
  const authorization = await AuthorizationFactory.deploy();
  
  // Wait for deployment to complete
  await authorization.waitForDeployment();
  
  // Get the contract address
  const contractAddress = await authorization.getAddress();
  const network = await ethers.provider.getNetwork();
  
  console.log("Authorization contract deployed to:", contractAddress);
  console.log("Network:", network.name, "Chain ID:", network.chainId.toString());
  
  // Update frontend configuration
  await updateFrontendConfig(contractAddress, Number(network.chainId));
  
  return contractAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
