import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

type Contract = any; // Temporal hasta generar typechain

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
      const taskDescription = "Desarrollar una función";
      const amount = ethers.parseEther("1.0");

      await expect(
        contract.connect(user1).createPublicEscrow(
          user2.address,
          taskDescription,
          { value: amount }
        )
      ).to.emit(contract, "EEscrowCreated");

      expect(await contract.getTotalEscrows()).to.equal(1);
    });

    it("No debe permitir crear escrow sin monto", async function () {
      await expect(
        contract.connect(user1).createPublicEscrow(
          user2.address,
          "Test task"
        )
      ).to.be.revertedWith("Debe enviar algo de dinero");
    });

    it("No debe permitir ser tu propio beneficiario", async function () {
      await expect(
        contract.connect(user1).createPublicEscrow(
          user1.address,
          "Test task",
          { value: ethers.parseEther("1.0") }
        )
      ).to.be.revertedWith("No puedes ser tu propio beneficiario");
    });

    it("No debe permitir crear escrow con deadline en el pasado", async function () {
      const block = await ethers.provider!.getBlock("latest");
      const pastDeadline = block!.timestamp - 3600;
      await expect(
        contract.connect(user1).createPublicEscrow(
          pastDeadline,
          user2.address,
          "Test task",
          { value: ethers.parseEther("1.0") }
        )
      ).to.be.revertedWith("Deadline debe ser en el futuro");
    });
  });

  describe("Confirmaciones", function () {
    let escrowId: number;

    beforeEach(async function () {
      const deadline = await getDeadline();
      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        "Tarea",
        { value: ethers.parseEther("1.0") }
      );
      escrowId = 0;
    });

    it("Solo el depositante puede llamar confirmByDepositor", async function () {
      await expect(
        contract.connect(user2).confirmByDepositor(escrowId)
      ).to.be.revertedWith("Solo el depositante puede confirmar");

      await expect(contract.connect(user1).confirmByDepositor(escrowId))
        .to.emit(contract, "PartyConfirmed")
        .withArgs(escrowId, user1.address, true);
    });

    it("Solo el beneficiario puede llamar confirmByBeneficiary", async function () {
      await expect(
        contract.connect(user1).confirmByBeneficiary(escrowId)
      ).to.be.revertedWith("Solo el beneficiario puede confirmar");

      await expect(contract.connect(user2).confirmByBeneficiary(escrowId))
        .to.emit(contract, "PartyConfirmed")
        .withArgs(escrowId, user2.address, false);
    });

    it("No debe permitir confirmar dos veces (depositante)", async function () {
      await contract.connect(user1).confirmByDepositor(escrowId);
      await expect(
        contract.connect(user1).confirmByDepositor(escrowId)
      ).to.be.revertedWith("Ya confirmaste");
    });

    it("No debe permitir confirmar dos veces (beneficiario)", async function () {
      await contract.connect(user2).confirmByBeneficiary(escrowId);
      await expect(
        contract.connect(user2).confirmByBeneficiary(escrowId)
      ).to.be.revertedWith("Ya confirmaste");
    });

    it("No debe permitir confirmar si el plazo venció", async function () {
      const block = await ethers.provider!.getBlock("latest");
      const deadline = block!.timestamp + 60; // 1 minuto
      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        "Tarea corta",
        { value: ethers.parseEther("0.1") }
      );
      const escrowCorto = 1;
      await time.increase(61);
      await expect(
        contract.connect(user1).confirmByDepositor(escrowCorto)
      ).to.be.revertedWith("Plazo vencido");
    });
  });

  describe("Gestión de Tareas", function () {
    let escrowId: number;

    beforeEach(async function () {
      // Crear un escrow público para las pruebas
      const taskDescription = "Tarea de prueba";
      const amount = ethers.parseEther("1.0");

      await contract.connect(user1).createPublicEscrow(
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

    it("Debe permitir liberar fondos después de completar tarea", async function () {
      // Marcar como completada
      await contract.markTaskCompleted(escrowId);

      // Verificar balance inicial
      const initialBalance = await ethers.provider.getBalance(user2.address);

      // Liberar fondos
      await expect(
        contract.connect(user1).releaseFunds(escrowId)
      ).to.emit(contract, "PrivateFundsReleased");

      // Verificar que recibió los fondos
      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("No debe permitir liberar fondos sin completar tarea", async function () {
      await expect(
        contract.connect(user1).releaseFunds(escrowId)
      ).to.be.revertedWith("Tarea no completada");
    });

    it("El beneficiario puede liberar fondos públicos cuando ambas partes confirmaron", async function () {
      await contract.connect(user1).confirmByDepositor(escrowId);
      await contract.connect(user2).confirmByBeneficiary(escrowId);
      const initialBalance = await ethers.provider.getBalance(user2.address);
      await expect(
        contract.connect(user2).releaseFunds(escrowId)
      ).to.emit(contract, "PrivateFundsReleased");
      const finalBalance = await ethers.provider.getBalance(user2.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Debe rechazar markTaskCompletedWithZK si el hash no coincide con la descripción", async function () {
      const wrongHash = ethers.keccak256(ethers.toUtf8Bytes("Otra descripción"));
      await expect(
        contract.markTaskCompletedWithZK(escrowId, wrongHash, "0x")
      ).to.be.revertedWith("Hash de tarea no coincide");
    });

    it("Debe marcar tarea completada con markTaskCompletedWithZK cuando el hash coincide", async function () {
      const taskDescription = "Tarea de prueba";
      const taskHash = ethers.keccak256(ethers.toUtf8Bytes(taskDescription));
      const zkProofBytes = "0x70726f6f66"; // "proof" en hex válido
      await expect(
        contract.markTaskCompletedWithZK(escrowId, taskHash, zkProofBytes)
      ).to.emit(contract, "TaskCompletedWithZK")
        .withArgs(escrowId, taskHash, owner.address);

      const verification = await contract.getTaskVerification(escrowId);
      expect(verification[0]).to.equal(taskHash);
      expect(verification[2]).to.equal(owner.address);
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

    it("Solo el depositante o el owner pueden cancelar (beneficiario no)", async function () {
      await expect(
        contract.connect(user2).cancelEscrow(escrowId)
      ).to.be.revertedWith("Solo el depositante o el owner pueden cancelar");
    });

    it("releasePrivateFunds en escrow público debe revertir", async function () {
      await expect(
        contract.connect(user1).releasePrivateFunds(escrowId, "0x")
      ).to.be.revertedWith("Use releaseFunds para escrows publicos");
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
      const taskDescription = "Tarea privada";
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await expect(
        contract.connect(user1).createPrivateEscrow(
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
      // Crear un usuario no registrado
      const [, , user3] = await ethers.getSigners();
      
      // Asegurar que user3 NO está registrado
      await mockEERC20.mockUnregisterUser(user3.address);
      expect(await mockEERC20.isRegistered(user3.address)).to.be.false;

      const taskDescription = "Tarea privada";
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await expect(
        contract.connect(user3).createPrivateEscrow(
          user1.address, // Cambiar beneficiario a user1 que sí está registrado
          encryptedAmount,
          zkProof,
          taskDescription
        )
      ).to.be.revertedWith("Usuario no registrado para privacidad");
    });

    it("releaseFunds en escrow privado debe revertir", async function () {
      const deadline = await getDeadline();
      const taskDescription = "Tarea privada";
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await contract.connect(user1).createPrivateEscrow(
        deadline,
        user2.address,
        encryptedAmount,
        zkProof,
        taskDescription
      );
      await expect(
        contract.connect(user1).releaseFunds(0)
      ).to.be.revertedWith("Use releasePrivateFunds para escrows privados");
    });

    it("Debe liberar fondos privados cuando ambas partes confirman (releasePrivateFunds)", async function () {
      const deadline = await getDeadline();
      const taskDescription = "Tarea privada a liberar";
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await contract.connect(user1).createPrivateEscrow(
        deadline,
        user2.address,
        encryptedAmount,
        zkProof,
        taskDescription
      );
      const escrowIdPriv = 0;
      await contract.connect(user1).confirmByDepositor(escrowIdPriv);
      await contract.connect(user2).confirmByBeneficiary(escrowIdPriv);

      const releaseProof = "0xdeadbeef";
      await expect(
        contract.connect(user1).releasePrivateFunds(escrowIdPriv, releaseProof)
      ).to.emit(contract, "PrivateFundsReleased");

      const details = await contract.getEscrowDetails(escrowIdPriv);
      expect(details[6]).to.be.true; // isReleased
    });

    it("Debe permitir cancelar escrow privado (cancelPrivateEscrow)", async function () {
      const deadline = await getDeadline();
      const taskDescription = "Tarea privada a cancelar";
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";

      await contract.connect(user1).createPrivateEscrow(
        deadline,
        user2.address,
        encryptedAmount,
        zkProof,
        taskDescription
      );
      const escrowIdPriv = 0;
      await expect(
        contract.connect(user1).cancelPrivateEscrow(escrowIdPriv, "0x")
      ).to.emit(contract, "EEscrowCanceled");

      const details = await contract.getEscrowDetails(escrowIdPriv);
      expect(details[6]).to.be.true; // isReleased
    });

    it("Solo depositante u owner pueden cancelar escrow privado", async function () {
      const deadline = await getDeadline();
      const encryptedAmount = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const zkProof = "0xabcdef1234567890";
      await contract.connect(user1).createPrivateEscrow(
        deadline,
        user2.address,
        encryptedAmount,
        zkProof,
        "Tarea"
      );
      await expect(
        contract.connect(user2).cancelPrivateEscrow(0, "0x")
      ).to.be.revertedWith("Solo el depositante o el owner pueden cancelar");
    });
  });

  describe("Consultas", function () {
    it("Debe retornar detalles del escrow correctos", async function () {
      const taskDescription = "Tarea de consulta";
      const amount = ethers.parseEther("2.0");

      await contract.connect(user1).createPublicEscrow(
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
    });

    it("Debe retornar escrows del usuario", async function () {
      await contract.connect(user1).createPublicEscrow(
        user2.address,
        "Tarea 1",
        { value: ethers.parseEther("1.0") }
      );

      await contract.connect(user1).createPublicEscrow(
        user2.address,
        "Tarea 2",
        { value: ethers.parseEther("1.0") }
      );

      const userEscrows = await contract.getUserEscrows(user1.address);
      expect(userEscrows.length).to.equal(2);
      expect(userEscrows[0]).to.equal(0);
      expect(userEscrows[1]).to.equal(1);
    });

    it("getTaskVerification retorna verificación después de marcar completada", async function () {
      const deadline = await getDeadline();
      const taskDescription = "Tarea verificada";
      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        taskDescription,
        { value: ethers.parseEther("1.0") }
      );
      const taskHash = ethers.keccak256(ethers.toUtf8Bytes(taskDescription));
      await contract.markTaskCompletedWithZK(0, taskHash, "0x");

      const [hash, proof, verifier, verificationTime] = await contract.getTaskVerification(0);
      expect(hash).to.equal(taskHash);
      expect(verifier).to.equal(owner.address);
      expect(verificationTime).to.be.gt(0);
    });

    it("isRegisteredForPrivacy delega al token encriptado", async function () {
      await mockEERC20.mockRegisterUser(user1.address);
      expect(await contract.isRegisteredForPrivacy(user1.address)).to.be.true;
      await mockEERC20.mockUnregisterUser(user1.address);
      expect(await contract.isRegisteredForPrivacy(user1.address)).to.be.false;
    });

    it("getUserEncryptedBalance delega al token encriptado", async function () {
      const balance = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      await mockEERC20.mockRegisterUser(user1.address);
      await mockEERC20.mockSetEncryptedBalance(user1.address, balance);
      expect(await contract.getUserEncryptedBalance(user1.address)).to.equal(balance);
    });

    it("getEscrowDetails con id inexistente debe revertir", async function () {
      await expect(contract.getEscrowDetails(999)).to.be.revertedWith("Escrow no existe");
    });
  });

  describe("Owner", function () {
    it("Solo el owner puede actualizar contratos eERC20 (updateEERC20Contracts)", async function () {
      const [newMockEERC20, newMockRegistrar] = await Promise.all([
        (await ethers.getContractFactory("MockEERC20")).deploy(),
        (await ethers.getContractFactory("MockRegistrar")).deploy(),
      ]);
      await expect(
        contract.connect(user1).updateEERC20Contracts(
          await newMockEERC20.getAddress(),
          await newMockRegistrar.getAddress()
        )
      ).to.be.revertedWith("Solo el propietario puede realizar esta accion");

      await contract.updateEERC20Contracts(
        await newMockEERC20.getAddress(),
        await newMockRegistrar.getAddress()
      );
      expect(await contract.encryptedToken()).to.equal(await newMockEERC20.getAddress());
    });

    it("Owner puede retirar ETH no comprometido (withdraw)", async function () {
      // Enviar ETH extra al contrato (sin crear escrow)
      await user1.sendTransaction({
        to: await contract.getAddress(),
        value: ethers.parseEther("1.0"),
      });
      const balanceBefore = await ethers.provider.getBalance(owner.address);
      await contract.withdraw();
      const balanceAfter = await ethers.provider.getBalance(owner.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("withdraw no debe retirar fondos comprometidos en escrows públicos", async function () {
      const deadline = await getDeadline();
      await contract.connect(user1).createPublicEscrow(
        deadline,
        user2.address,
        "Tarea",
        { value: ethers.parseEther("1.0") }
      );
      // Enviar ETH extra
      await user1.sendTransaction({
        to: await contract.getAddress(),
        value: ethers.parseEther("0.5"),
      });
      await contract.withdraw();
      // El contrato debe seguir teniendo el 1.0 del escrow (no retirado)
      const contractBalance = await ethers.provider.getBalance(await contract.getAddress());
      expect(contractBalance).to.equal(ethers.parseEther("1.0"));
    });
  });
});

// Mock contracts would be needed to be implemented separately
// These should be in separate .sol files in contracts/mocks/