// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title AuthorizationWithEERC20Escrow
 * @dev Contrato de escrow con soporte para eERC20 (Encrypted ERC20) de Avalanche
 * Permite crear tareas con pagos públicos (ETH) o privados (eERC20 encriptado)
 */

// Interfaces para interactuar con eERC20 de Avalanche
interface IEncryptedERC20 {
    function transferEncrypted(
        address to,
        bytes32 encryptedAmount,
        bytes calldata zkProof
    ) external returns (bool);
    
    function depositFromERC20(
        uint256 amount,
        bytes32 encryptedAmount,
        bytes calldata zkProof
    ) external returns (bool);
    
    function withdrawToERC20(
        uint256 amount,
        bytes32 encryptedAmount,
        bytes calldata zkProof
    ) external returns (bool);
    
    function getEncryptedBalance(address user) external view returns (bytes32);
    function isRegistered(address user) external view returns (bool);
}

interface IRegistrar {
    function register(bytes calldata publicKey, bytes calldata zkProof) external;
    function getPublicKey(address user) external view returns (bytes memory);
}

contract AuthorizationWithEERC20Escrow {
    address public owner;
    
    // Contratos eERC20
    IEncryptedERC20 public encryptedToken;
    IRegistrar public registrar;
    
    // Mapeo para verificar si una dirección está autorizada
    mapping(address => bool) public authorizedUsers;
    
    // Estructura para manejar depósitos en escrow con eERC20
    struct EEscrowDeposit {
        uint256 deadline;            // Campo de tiempo límite para que partes acuerden
        bool depositorConfirmed;     // Si el depositante ha confirmado la tarea
        bool beneficiaryConfirmed;   // Si el beneficiario ha confirmado la tarea
        address depositor;           // Quien deposita el dinero
        address beneficiary;         // Quien recibirá el dinero
        bytes32 encryptedAmount;     // Cantidad encriptada
        string taskDescription;      // Descripción de la tarea
        bool isCompleted;           // Si la tarea está completada
        bool isReleased;            // Si el dinero ya fue liberado
        uint256 timestamp;          // Cuando se creó el depósito
        bytes32 depositorProof;     // Proof del depositante
        bool isPrivate;             // Si es un escrow privado o público
        uint256 publicAmount;       // Para escrows no privados (fallback)
    }
    
    // Estructura para tareas verificables con ZK
    struct TaskVerification {
        bytes32 taskHash;           // Hash de la tarea
        bytes zkProof;              // Prueba zero-knowledge de completación
        address verifier;           // Quien verificó la tarea
        uint256 verificationTime;   // Timestamp de verificación
    }
    
    // Contador para IDs únicos de depósitos
    uint256 private escrowCounter;
    
    // Mapeos
    mapping(uint256 => EEscrowDeposit) public escrowDeposits;
    mapping(uint256 => TaskVerification) public taskVerifications;
    mapping(address => uint256[]) public userEscrows;
    mapping(bytes32 => bool) public usedProofs; // Prevenir replay attacks
    
    // Eventos
    event UserAuthorized(address indexed user, bool isAuthorized);
    /// @dev Evento de retención de fondos: el dinero queda en escrow hasta acuerdo de partes o cancelación
    event EEscrowCreated(
        uint256 indexed escrowId,
        address indexed depositor,
        address indexed beneficiary,
        bytes32 encryptedAmount,
        string taskDescription,
        bool isPrivate
    );
    event PartyConfirmed(uint256 indexed escrowId, address indexed party, bool isDepositor);
    event TaskCompletedWithZK(
        uint256 indexed escrowId,
        bytes32 taskHash,
        address indexed verifier
    );
    event PrivateFundsReleased(
        uint256 indexed escrowId,
        address indexed beneficiary,
        bytes32 encryptedAmount
    );
    event EEscrowCanceled(
        uint256 indexed escrowId,
        address indexed depositor
    );
    event UserRegisteredForPrivacy(address indexed user);
    
    constructor(address _encryptedToken, address _registrar) {
        owner = msg.sender;
        authorizedUsers[msg.sender] = true;
        escrowCounter = 0;
        encryptedToken = IEncryptedERC20(_encryptedToken);
        registrar = IRegistrar(_registrar);
    }
    
    // Modificadores
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede realizar esta accion");
        _;
    }
    
    modifier onlyAuthorized() {
        require(
            msg.sender == owner || authorizedUsers[msg.sender],
            "No autorizado"
        );
        _;
    }
    
    modifier validEscrow(uint256 _escrowId) {
        require(_escrowId < escrowCounter, "Escrow no existe");
        _;
    }
    
    modifier onlyRegistered() {
        require(encryptedToken.isRegistered(msg.sender), "Usuario no registrado para privacidad");
        _;
    }
    
    // Funciones de autorización existentes
    function setUserAuthorization(address user, bool _isAuthorized) public onlyOwner {
        authorizedUsers[user] = _isAuthorized;
        emit UserAuthorized(user, _isAuthorized);
    }
    
    function isAuthorized(address _address) public view returns (bool) {
        return _address == owner || authorizedUsers[_address];
    }
    
    // NUEVAS FUNCIONES PARA eERC20
    
    /**
     * @dev Registrar usuario para usar funciones de privacidad
     */
    function registerForPrivacy(
        bytes calldata publicKey,
        bytes calldata zkProof
    ) public {
        registrar.register(publicKey, zkProof);
        emit UserRegisteredForPrivacy(msg.sender);
    }
    
    /**
     * @dev Crea un escrow privado usando eERC20 para encriptar el monto
     * @param _beneficiary Dirección que recibirá los fondos al completar la tarea
     * @param _encryptedAmount Monto encriptado usando eERC20 de Avalanche
     * @param _zkProof Prueba criptográfica para la transacción eERC20
     * @param _taskDescription Descripción de la tarea a realizar
     */
    function createPrivateEscrow(
        uint256 _deadline,
        address _beneficiary,
        bytes32 _encryptedAmount,
        bytes calldata _zkProof,
        string memory _taskDescription
    ) public onlyRegistered {
        require(_deadline > block.timestamp, "Deadline debe ser en el futuro");
        require(_beneficiary != address(0), "Beneficiario invalido");
        require(_beneficiary != msg.sender, "No puedes ser tu propio beneficiario");
        require(bytes(_taskDescription).length > 0, "Descripcion de tarea requerida");
        require(encryptedToken.isRegistered(_beneficiary), "Beneficiario no registrado");
        
        // Prevenir replay attacks
        bytes32 proofHash = keccak256(_zkProof);
        require(!usedProofs[proofHash], "Proof ya utilizado");
        usedProofs[proofHash] = true;
        
        uint256 escrowId = escrowCounter;
        
        escrowDeposits[escrowId] = EEscrowDeposit({
            deadline: _deadline,
            depositorConfirmed: false,
            beneficiaryConfirmed: false,
            depositor: msg.sender,
            beneficiary: _beneficiary,
            encryptedAmount: _encryptedAmount,
            taskDescription: _taskDescription,
            isCompleted: false,
            isReleased: false,
            timestamp: block.timestamp,
            depositorProof: proofHash,
            isPrivate: true,
            publicAmount: 0
        });
        
        userEscrows[msg.sender].push(escrowId);
        escrowCounter++;
        
        // Transferir tokens encriptados al contrato
        require(
            encryptedToken.transferEncrypted(address(this), _encryptedAmount, _zkProof),
            "Transferencia encriptada fallida"
        );
        
        emit EEscrowCreated(
            escrowId,
            msg.sender,
            _beneficiary,
            _encryptedAmount,
            _taskDescription,
            true
        );
    }
    
    /**
     * @dev Crear un escrow público tradicional (fallback)
     */
    function createPublicEscrow(
        uint256 _deadline,
        address _beneficiary,
        string memory _taskDescription
    ) public payable {
        require(msg.value > 0, "Debe enviar algo de dinero");
        require(_deadline > block.timestamp, "Deadline debe ser en el futuro");
        require(_beneficiary != address(0), "Beneficiario invalido");
        require(_beneficiary != msg.sender, "No puedes ser tu propio beneficiario");
        require(bytes(_taskDescription).length > 0, "Descripcion de tarea requerida");
        
        uint256 escrowId = escrowCounter;
        
        escrowDeposits[escrowId] = EEscrowDeposit({
            deadline: _deadline,
            depositorConfirmed: false,
            beneficiaryConfirmed: false,
            depositor: msg.sender,
            beneficiary: _beneficiary,
            encryptedAmount: 0,
            taskDescription: _taskDescription,
            isCompleted: false,
            isReleased: false,
            timestamp: block.timestamp,
            depositorProof: 0,
            isPrivate: false,
            publicAmount: msg.value
        });
        
        userEscrows[msg.sender].push(escrowId);
        escrowCounter++;
        
        emit EEscrowCreated(
            escrowId,
            msg.sender,
            _beneficiary,
            0,
            _taskDescription,
            false
        );
    }
    
    /**
     * @dev El depositante confirma que la tarea fue completada con éxito (acuerdo Opción A)
     */
    function confirmByDepositor(uint256 _escrowId) public validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        require(msg.sender == deposit.depositor, "Solo el depositante puede confirmar");
        require(!deposit.isReleased, "Escrow ya liberado o cancelado");
        require(block.timestamp <= deposit.deadline, "Plazo vencido");
        require(!deposit.depositorConfirmed, "Ya confirmaste");
        deposit.depositorConfirmed = true;
        emit PartyConfirmed(_escrowId, msg.sender, true);
    }
    
    /**
     * @dev El beneficiario confirma que la tarea fue completada con éxito (acuerdo Opción A)
     */
    function confirmByBeneficiary(uint256 _escrowId) public validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        require(msg.sender == deposit.beneficiary, "Solo el beneficiario puede confirmar");
        require(!deposit.isReleased, "Escrow ya liberado o cancelado");
        require(block.timestamp <= deposit.deadline, "Plazo vencido");
        require(!deposit.beneficiaryConfirmed, "Ya confirmaste");
        deposit.beneficiaryConfirmed = true;
        emit PartyConfirmed(_escrowId, msg.sender, false);
    }
    
    /**
     * @dev Marcar tarea completada con zero-knowledge proof
     */
    function markTaskCompletedWithZK(
        uint256 _escrowId,
        bytes32 _taskHash,
        bytes calldata _zkProof
    ) public onlyAuthorized validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        require(!deposit.isCompleted, "Tarea ya completada");
        require(!deposit.isReleased, "Fondos ya liberados");
        
        // Verificar que el hash de la tarea coincide con la descripción
        bytes32 expectedHash = keccak256(abi.encodePacked(deposit.taskDescription));
        require(_taskHash == expectedHash, "Hash de tarea no coincide");
        
        deposit.isCompleted = true;
        
        taskVerifications[_escrowId] = TaskVerification({
            taskHash: _taskHash,
            zkProof: _zkProof,
            verifier: msg.sender,
            verificationTime: block.timestamp
        });
        
        emit TaskCompletedWithZK(_escrowId, _taskHash, msg.sender);
    }
    
    /**
     * @dev Marcar tarea completada (método tradicional)
     */
    function markTaskCompleted(uint256 _escrowId) public onlyAuthorized validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        require(!deposit.isCompleted, "Tarea ya completada");
        require(!deposit.isReleased, "Fondos ya liberados");
        
        deposit.isCompleted = true;
        
        bytes32 taskHash = keccak256(abi.encodePacked(deposit.taskDescription));
        taskVerifications[_escrowId] = TaskVerification({
            taskHash: taskHash,
            zkProof: "",
            verifier: msg.sender,
            verificationTime: block.timestamp
        });
        
        emit TaskCompletedWithZK(_escrowId, taskHash, msg.sender);
    }
    
    /**
     * @dev Liberar fondos privados
     */
    function releasePrivateFunds(
        uint256 _escrowId,
        bytes calldata _zkProof
    ) public validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        
        require(deposit.isPrivate, "Use releaseFunds para escrows publicos");
        require(
            msg.sender == deposit.depositor || 
            msg.sender == deposit.beneficiary || 
            isAuthorized(msg.sender),
            "No autorizado para liberar fondos"
        );
        require(deposit.depositorConfirmed && deposit.beneficiaryConfirmed, "Ambas partes deben confirmar");
        require(block.timestamp <= deposit.deadline, "Plazo vencido");
        require(!deposit.isReleased, "Fondos ya liberados");
        
        deposit.isReleased = true;
        
        // Transferir tokens encriptados al beneficiario
        require(
            encryptedToken.transferEncrypted(
                deposit.beneficiary,
                deposit.encryptedAmount,
                _zkProof
            ),
            "Transferencia encriptada fallida"
        );
        
        emit PrivateFundsReleased(_escrowId, deposit.beneficiary, deposit.encryptedAmount);
    }
    
    /**
     * @dev Liberar fondos públicos (método tradicional)
     */
    function releaseFunds(uint256 _escrowId) public validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        
        require(!deposit.isPrivate, "Use releasePrivateFunds para escrows privados");
        require(
            msg.sender == deposit.depositor || 
            msg.sender == deposit.beneficiary || 
            isAuthorized(msg.sender),
            "No autorizado para liberar fondos"
        );
        require(deposit.depositorConfirmed && deposit.beneficiaryConfirmed, "Ambas partes deben confirmar");
        require(block.timestamp <= deposit.deadline, "Plazo vencido");
        require(!deposit.isReleased, "Fondos ya liberados");
        
        deposit.isReleased = true;
        payable(deposit.beneficiary).transfer(deposit.publicAmount);
        
        emit PrivateFundsReleased(_escrowId, deposit.beneficiary, 0);
    }
    
    /**
     * @dev Cancelar escrow privado. Antes del deadline: solo si no completado. Tras el deadline: si no hubo acuerdo de ambas partes.
     */
    function cancelPrivateEscrow(
        uint256 _escrowId,
        bytes calldata _zkProof
    ) public validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        
        require(deposit.isPrivate, "Use cancelEscrow para escrows publicos");
        require(
            msg.sender == deposit.depositor || msg.sender == owner,
            "Solo el depositante o el owner pueden cancelar"
        );
        require(!deposit.isReleased, "Fondos ya liberados");
        if (block.timestamp <= deposit.deadline) {
            require(!deposit.isCompleted, "No se puede cancelar una tarea completada");
        } else {
            require(!deposit.depositorConfirmed || !deposit.beneficiaryConfirmed, "Ambas partes acordaron, no se puede cancelar");
        }
        
        deposit.isReleased = true;
        
        // Devolver tokens encriptados al depositante
        require(
            encryptedToken.transferEncrypted(
                deposit.depositor,
                deposit.encryptedAmount,
                _zkProof
            ),
            "Devolucion encriptada fallida"
        );
        
        emit EEscrowCanceled(_escrowId, deposit.depositor);
    }
    
    /**
     * @dev Cancelar escrow público. Antes del deadline: solo si no completado. Tras el deadline: si no hubo acuerdo de ambas partes.
     */
    function cancelEscrow(uint256 _escrowId) public validEscrow(_escrowId) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        
        require(!deposit.isPrivate, "Use cancelPrivateEscrow para escrows privados");
        require(
            msg.sender == deposit.depositor || msg.sender == owner,
            "Solo el depositante o el owner pueden cancelar"
        );
        require(!deposit.isReleased, "Fondos ya liberados");
        if (block.timestamp <= deposit.deadline) {
            require(!deposit.isCompleted, "No se puede cancelar una tarea completada");
        } else {
            require(!deposit.depositorConfirmed || !deposit.beneficiaryConfirmed, "Ambas partes acordaron, no se puede cancelar");
        }
        
        deposit.isReleased = true;
        payable(deposit.depositor).transfer(deposit.publicAmount);
        
        emit EEscrowCanceled(_escrowId, deposit.depositor);
    }
    
    // FUNCIONES DE CONSULTA
    
    /**
     * @dev Obtener detalles de un escrow
     */
    function getEscrowDetails(uint256 _escrowId) public view validEscrow(_escrowId) returns (
        address depositor,
        address beneficiary,
        bytes32 encryptedAmount,
        uint256 publicAmount,
        string memory taskDescription,
        bool isCompleted,
        bool isReleased,
        bool isPrivate,
        uint256 timestamp,
        uint256 deadline,
        bool depositorConfirmed,
        bool beneficiaryConfirmed
    ) {
        EEscrowDeposit storage deposit = escrowDeposits[_escrowId];
        return (
            deposit.depositor,
            deposit.beneficiary,
            deposit.encryptedAmount,
            deposit.publicAmount,
            deposit.taskDescription,
            deposit.isCompleted,
            deposit.isReleased,
            deposit.isPrivate,
            deposit.timestamp,
            deposit.deadline,
            deposit.depositorConfirmed,
            deposit.beneficiaryConfirmed
        );
    }
    
    /**
     * @dev Obtener verificación de tarea
     */
    function getTaskVerification(uint256 _escrowId) public view validEscrow(_escrowId) returns (
        bytes32 taskHash,
        bytes memory zkProof,
        address verifier,
        uint256 verificationTime
    ) {
        TaskVerification storage verification = taskVerifications[_escrowId];
        return (
            verification.taskHash,
            verification.zkProof,
            verification.verifier,
            verification.verificationTime
        );
    }
    
    /**
     * @dev Verificar si un usuario está registrado para privacidad
     */
    function isRegisteredForPrivacy(address _user) public view returns (bool) {
        return encryptedToken.isRegistered(_user);
    }
    
    /**
     * @dev Obtener balance encriptado de un usuario
     */
    function getUserEncryptedBalance(address _user) public view returns (bytes32) {
        return encryptedToken.getEncryptedBalance(_user);
    }
    
    /**
     * @dev Obtener todos los escrows de un usuario
     */
    function getUserEscrows(address _user) public view returns (uint256[] memory) {
        return userEscrows[_user];
    }
    
    /**
     * @dev Obtener el total de escrows creados
     */
    function getTotalEscrows() public view returns (uint256) {
        return escrowCounter;
    }
    
    /**
     * @dev Función para recibir pagos (solo para escrows públicos)
     */
    receive() external payable {}
    
    /**
     * @dev Retirar fondos no comprometidos en escrows públicos
     */
    function withdraw() public onlyOwner {
        uint256 committedFunds = 0;
        for (uint256 i = 0; i < escrowCounter; i++) {
            if (!escrowDeposits[i].isReleased && !escrowDeposits[i].isPrivate) {
                committedFunds += escrowDeposits[i].publicAmount;
            }
        }
        
        uint256 availableBalance = address(this).balance - committedFunds;
        require(availableBalance > 0, "No hay fondos disponibles para retirar");
        
        payable(owner).transfer(availableBalance);
    }
    
    /**
     * @dev Actualizar direcciones de contratos eERC20 (solo owner)
     */
    function updateEERC20Contracts(
        address _newEncryptedToken,
        address _newRegistrar
    ) public onlyOwner {
        encryptedToken = IEncryptedERC20(_newEncryptedToken);
        registrar = IRegistrar(_newRegistrar);
    }
}