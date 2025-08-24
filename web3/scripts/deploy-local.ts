import hre from "hardhat";
const { ethers } = hre;
import { writeFileSync, existsSync, mkdirSync } from "fs";

// Temporal hasta generar typechain
type Contract = any;

interface DeployInfo {
  network: string;
  chainId: string;
  contracts: {
    main: string;
    mockToken: string;
    mockRegistrar: string;
  };
  users: {
    deployer: string;
    user1: string;
    user2: string;
  };
  testData: {
    totalTasks: string;
    mockEncryptedAmount: string;
  };
  deployedAt: string;
}

async function main(): Promise<void> {
  console.log("🚀 Deployando en red local para testing...\n");

  const [deployer, user1, user2] = await ethers.getSigners();
  
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 User1:", user1.address);
  console.log("👤 User2:", user2.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");

  // 1. Deploy Mock Contracts
  console.log("📦 Deployando MockEERC20...");
  const MockEERC20Factory = await ethers.getContractFactory("MockEERC20");
  const mockToken: Contract = await MockEERC20Factory.deploy();
  await mockToken.waitForDeployment();
  const tokenAddress = await mockToken.getAddress();
  console.log("✅ MockEERC20 deployado en:", tokenAddress);

  console.log("📦 Deployando MockRegistrar...");
  const MockRegistrarFactory = await ethers.getContractFactory("MockRegistrar");
  const mockRegistrar: Contract = await MockRegistrarFactory.deploy();
  await mockRegistrar.waitForDeployment();
  const registrarAddress = await mockRegistrar.getAddress();
  console.log("✅ MockRegistrar deployado en:", registrarAddress);

  // 2. Deploy Main Contract
  console.log("\n📦 Deployando AuthorizationWithEERC20Escrow...");
  const MainContractFactory = await ethers.getContractFactory("AuthorizationWithEERC20Escrow");
  const mainContract: Contract = await MainContractFactory.deploy(
    tokenAddress, 
    registrarAddress
  );
  await mainContract.waitForDeployment();
  const contractAddress = await mainContract.getAddress();
  console.log("✅ Contrato principal deployado en:", contractAddress);

  // 3. Setup inicial para testing
  console.log("\n🔧 Configurando usuarios para testing...");
  
  try {
    // Registrar usuarios en el mock
    await mockToken.mockRegisterUser(user1.address);
    await mockToken.mockRegisterUser(user2.address);
    await mockRegistrar.mockRegisterUser(user1.address, "0x1234567890abcdef");
    await mockRegistrar.mockRegisterUser(user2.address, "0x567890abcdef1234");
    
    // Autorizar user1 como usuario autorizado
    await mainContract.setUserAuthorization(user1.address, true);
    
    console.log("✅ User1 registrado y autorizado");
    console.log("✅ User2 registrado");
  } catch (error) {
    console.log("⚠️ Error en setup inicial:", (error as Error).message);
    throw error;
  }

  // 4. Crear algunas tareas de ejemplo
  console.log("\n📋 Creando tareas de ejemplo...");
  
  try {
    // Tarea pública
    const publicTaskTx = await mainContract.connect(user1).createPublicEscrow(
      user2.address,
      "Desarrollar feature X - Implementar sistema de autenticación",
      { value: ethers.parseEther("1.0") }
    );
    await publicTaskTx.wait();
    console.log("✅ Tarea pública creada (ID: 0)");

    // Tarea "privada" simulada
    const mockEncryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockProof = "0xabcdef1234567890abcdef1234567890";
    
    const privateTaskTx = await mainContract.connect(user1).createPrivateEscrow(
      user2.address,
      mockEncryptedAmount,
      mockProof,
      "Tarea confidencial Y - Auditoría de seguridad"
    );
    await privateTaskTx.wait();
    console.log("✅ Tarea privada simulada creada (ID: 1)");
    
  } catch (error) {
    console.log("⚠️ Error creando tareas:", (error as Error).message.split('(')[0]);
    console.log("   (Esto puede ser normal si hay validaciones estrictas)");
  }

  // 5. Crear una tarea completada para mostrar el flujo completo
  console.log("\n🎯 Creando escenario de tarea completada...");
  try {
    const completedTaskTx = await mainContract.connect(user1).createPublicEscrow(
      user2.address,
      "Tarea completada de ejemplo",
      { value: ethers.parseEther("0.5") }
    );
    await completedTaskTx.wait();
    
    const taskId = await mainContract.getTotalEscrows() - BigInt(1);
    
    // Marcar como completada
    await mainContract.markTaskCompleted(taskId);
    console.log(`✅ Tarea ${taskId} marcada como completada`);
    
  } catch (error) {
    console.log("⚠️ Error en tarea completada:", (error as Error).message);
  }

  // 6. Información final
  const totalTasks = await mainContract.getTotalEscrows();
  const user1Tasks = await mainContract.getUserEscrows(user1.address);
  
  console.log("\n📊 RESUMEN DEL DEPLOYMENT:");
  console.log("==========================");
  console.log("🎯 Contrato Principal:", contractAddress);
  console.log("🪙 Mock Token:", tokenAddress);
  console.log("📝 Mock Registrar:", registrarAddress);
  console.log("📋 Total de tareas:", totalTasks.toString());
  console.log("👤 Tareas de User1:", user1Tasks.length);
  console.log("🌐 Red:", "localhost (31337)");

  console.log("\n🧪 COMANDOS DE TESTING:");
  console.log("======================");
  console.log("# Ejecutar tests:");
  console.log("npm run hardhat:test");
  console.log("\n# Consola interactiva:");
  console.log("npx hardhat console --network localhost");
  console.log("\n# Ejemplo de interacción:");
  console.log(`const contract = await ethers.getContractAt("AuthorizationWithEERC20Escrow", "${contractAddress}");`);
  console.log("const totalTasks = await contract.getTotalEscrows();");
  console.log("console.log('Total tasks:', totalTasks.toString());");

  // 7. Guardar información para el frontend
  const deployInfo: DeployInfo = {
    network: "localhost",
    chainId: "31337",
    contracts: {
      main: contractAddress,
      mockToken: tokenAddress,
      mockRegistrar: registrarAddress
    },
    users: {
      deployer: deployer.address,
      user1: user1.address,
      user2: user2.address
    },
    testData: {
      totalTasks: totalTasks.toString(),
      mockEncryptedAmount: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    },
    deployedAt: new Date().toISOString()
  };

  // Crear directorio si no existe
  if (!existsSync('deployments')) {
    mkdirSync('deployments');
  }
  
  writeFileSync(
    'deployments/localhost-deployment.json', 
    JSON.stringify(deployInfo, null, 2)
  );
  console.log("\n💾 Información guardada en: deployments/localhost-deployment.json");

  // 8. Actualizar config del frontend si existe
  try {
    const frontendConfigPath = '../frontend/src/config/contracts.ts';
    if (existsSync(frontendConfigPath)) {
      const configUpdate = `// Auto-generated from deploy script
export const CONTRACT_ADDRESSES = {
  31337: {
    authorization: "${contractAddress}",
    mockToken: "${tokenAddress}",
    mockRegistrar: "${registrarAddress}"
  }
} as const;

export const getContractAddress = (chainId: number, contractName: string) => {
  const networkAddresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!networkAddresses) {
    throw new Error(\`No contract addresses configured for chain ID \${chainId}\`);
  }
  return networkAddresses[contractName as keyof typeof networkAddresses];
};

export const AUTHORIZATION_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[31337].authorization;
`;
      writeFileSync(frontendConfigPath, configUpdate);
      console.log("🔄 Frontend config actualizado automáticamente");
    }
  } catch (error) {
    console.log("⚠️ No se pudo actualizar config del frontend:", (error as Error).message);
  }

  console.log("\n🎉 Deploy local completado exitosamente!");
  console.log("🔗 Puedes usar estas direcciones en tu frontend para testing");
  console.log("\n💡 Próximos pasos:");
  console.log("   1. npm run hardhat:test (ejecutar tests)");
  console.log("   2. npm run dev (iniciar frontend)");
  console.log("   3. Conectar MetaMask a localhost:8545");
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error("❌ Error en el deploy:", error);
    process.exit(1);
  });
