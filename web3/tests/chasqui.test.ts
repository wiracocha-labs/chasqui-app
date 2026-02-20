import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

type Contract = any; // Temporal hasta generar typechain

async function getDeadline(): Promise<number> {
  const block = await ethers.provider!.getBlock("latest");
  return (block!.timestamp + 7 * 24 * 3600);
}

describe("AuthorizationWithEERC20Escrow", function () {
  let contract: Contract;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let mockEERC20: Contract;
  let mockRegistrar: Contract;

  beforeEach(async function () {
    // Obtener signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock contracts para testing
    const MockEERC20 = await ethers.getContractFactory("MockEERC20");
    mockEERC20 = await MockEERC20.deploy();

    const MockRegistrar = await ethers.getContractFactory("MockRegistrar");
    mockRegistrar = await MockRegistrar.deploy();

    // Deploy del contrato principal
    const ContractFactory = await ethers.getContractFactory("AuthorizationWithEERC20Escrow");
    contract = await ContractFactory.deploy(
      await mockEERC20.getAddress(),
      await mockRegistrar.getAddress()
    );
  });

  describe("Deployment", function () {
    it("Debe establecer el owner correcto", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Debe autorizar al owner por defecto", async function () {
      expect(await contract.isAuthorized(owner.address)).to.be.true;
    });

    it("Debe inicializar con 0 escrows", async function () {
      expect(await contract.getTotalEscrows()).to.equal(0);
    });
  });

  describe("Autorización", function () {
    it("Solo el owner puede autorizar usuarios", async function () {
      await contract.setUserAuthorization(user1.address, true);
      expect(await contract.isAuthorized(user1.address)).to.be.true;

      await expect(
        contract.connect(user1).setUserAuthorization(user2.address, true)
      ).to.be.revertedWith("Solo el propietario puede realizar esta accion");
    });

    it("Puede desautorizar usuarios", async function () {
      await contract.setUserAuthorization(user1.address, true);
      expect(await contract.isAuthorized(user1.address)).to.be.true;

      await contract.setUserAuthorization(user1.address, false);
      expect(await contract.isAuthorized(user1.address)).to.be.false;
    });
  });

  describe("Escrows Públicos", function () {
    it("Debe crear un escrow público", async function () {
      const deadline = await getDeadline();
      const taskDescription = "Desarrollar una función";
      const amount = ethers.parseEther("1.0");

      await expect(
        contract.connect(user1).createPublicEscrow(
          deadline,
          user2.address,
          taskDescription,
          { value: amount }
        )
      ).to.emit(contract, "EEscrowCreated");

      expect(await contract.getTotalEscrows()).to.equal(1);
    });

    it("No debe permitir crear escrow sin monto", async function () {
      const deadline = await getDeadline();
      await expect(
        contract.connect(user1).createPublicEscrow(
          deadline,
          user2.address,
          "Test task"
        )
      ).to.be.revertedWith("Debe enviar algo de dinero");
    });

    it("No debe permitir ser tu propio beneficiario", async function () {
      const deadline = await getDeadline();
      await expect(
        contract.connect(user1).createPublicEscrow(
          deadline,
          user1.address,
          "Test task",
          { value: ethers.parseEther("1.0") }
        )
      ).to.be.revertedWith("No puedes ser tu propio beneficiario");
    });
  });

  describe("Gestión de Tareas", function () {
    let escrowId: number;

    beforeEach(async function () {
      const deadline = await getDeadline();
      const taskDescription = "Tarea de prueba";
      const amount = ethers.parseEther("1.0");

      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        taskDescription,
        { value: amount }
      );
      escrowId = 0;
    });

    it("Solo usuarios autorizados pueden marcar tareas completadas", async function () {
      // El owner está autorizado por defecto
      await expect(
        contract.markTaskCompleted(escrowId)
      ).to.emit(contract, "TaskCompletedWithZK");

      await expect(
        contract.connect(user2).markTaskCompleted(escrowId)
      ).to.be.revertedWith("No autorizado");
    });

    it("Debe permitir liberar fondos cuando ambas partes confirman (Opción A)", async function () {
      await contract.connect(user1).confirmByDepositor(escrowId);
      await contract.connect(user2).confirmByBeneficiary(escrowId);

      const initialBalance = await ethers.provider.getBalance(user2.address);

      await expect(
        contract.connect(user1).releaseFunds(escrowId)
      ).to.emit(contract, "PrivateFundsReleased");

      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("No debe permitir liberar fondos sin confirmación de ambas partes", async function () {
      await expect(
        contract.connect(user1).releaseFunds(escrowId)
      ).to.be.revertedWith("Ambas partes deben confirmar");
    });

    it("Debe permitir cancelar escrow no completado", async function () {
      const initialBalance = await ethers.provider.getBalance(user1.address);

      await expect(
        contract.connect(user1).cancelEscrow(escrowId)
      ).to.emit(contract, "EEscrowCanceled");

      // Verificar que los fondos regresaron
      const finalBalance = await ethers.provider.getBalance(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Escrows Privados", function () {
    beforeEach(async function () {
      // Registrar usuarios para privacidad en el mock
      const mockPublicKey = "0x1234567890abcdef";
      await mockRegistrar.mockRegisterUser(user1.address, mockPublicKey);
      await mockRegistrar.mockRegisterUser(user2.address, mockPublicKey);
      await mockEERC20.mockRegisterUser(user1.address);
      await mockEERC20.mockRegisterUser(user2.address);
      // Registrar el contrato también para las transferencias
      await mockEERC20.mockRegisterUser(await contract.getAddress());
    });

    it("Debe permitir registro para privacidad", async function () {
      const publicKey = "0x1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await expect(
        contract.connect(user1).registerForPrivacy(publicKey, zkProof)
      ).to.emit(contract, "UserRegisteredForPrivacy")
        .withArgs(user1.address);
    });

    it("Debe crear un escrow privado", async function () {
      const deadline = await getDeadline();
      const taskDescription = "Tarea privada";
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await expect(
        contract.connect(user1).createPrivateEscrow(
          deadline,
          user2.address,
          encryptedAmount,
          zkProof,
          taskDescription
        )
      ).to.emit(contract, "EEscrowCreated");

      const details = await contract.getEscrowDetails(0);
      expect(details[7]).to.be.true; // isPrivate
    });

    it("No debe permitir crear escrow privado sin registro", async function () {
      const deadline = await getDeadline();
      const [, , user3] = await ethers.getSigners();
      
      await mockEERC20.mockUnregisterUser(user3.address);
      expect(await mockEERC20.isRegistered(user3.address)).to.be.false;

      const taskDescription = "Tarea privada";
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await expect(
        contract.connect(user3).createPrivateEscrow(
          deadline,
          user1.address,
          encryptedAmount,
          zkProof,
          taskDescription
        )
      ).to.be.revertedWith("Usuario no registrado para privacidad");
    });
  });

  describe("Consultas", function () {
    it("Debe retornar detalles del escrow correctos", async function () {
      const deadline = await getDeadline();
      const taskDescription = "Tarea de consulta";
      const amount = ethers.parseEther("2.0");

      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        taskDescription,
        { value: amount }
      );

      const details = await contract.getEscrowDetails(0);
      expect(details[0]).to.equal(user1.address); // depositor
      expect(details[1]).to.equal(user2.address); // beneficiary
      expect(details[3]).to.equal(amount); // publicAmount
      expect(details[4]).to.equal(taskDescription); // taskDescription
      expect(details[7]).to.be.false; // isPrivate
      expect(details[9]).to.equal(deadline); // deadline
    });

    it("Debe retornar escrows del usuario", async function () {
      const deadline = await getDeadline();
      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        "Tarea 1",
        { value: ethers.parseEther("1.0") }
      );

      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        "Tarea 2",
        { value: ethers.parseEther("1.0") }
      );

      const userEscrows = await contract.getUserEscrows(user1.address);
      expect(userEscrows.length).to.equal(2);
      expect(userEscrows[0]).to.equal(0);
      expect(userEscrows[1]).to.equal(1);
    });
  });
});

// Mock contracts would be needed to be implemented separately
// These should be in separate .sol files in contracts/mocks/