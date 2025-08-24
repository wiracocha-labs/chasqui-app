// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MockEERC20 {
    mapping(address => bytes32) private encryptedBalances;
    mapping(address => bool) private registeredUsers;
    mapping(address => uint256) private publicBalances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event EncryptedTransfer(address indexed from, address indexed to, bytes32 encryptedAmount);
    
    function transferEncrypted(
        address to,
        bytes32 encryptedAmount,
        bytes calldata zkProof
    ) external returns (bool) {
        require(registeredUsers[msg.sender], "User not registered");
        require(registeredUsers[to], "Recipient not registered");
        
        // Simular transferencia encriptada
        emit EncryptedTransfer(msg.sender, to, encryptedAmount);
        
        // Para testing, actualizamos balances simulados
        encryptedBalances[to] = encryptedAmount;
        
        return true;
    }
    
    function depositFromERC20(
        uint256 amount,
        bytes32 encryptedAmount,
        bytes calldata zkProof
    ) external returns (bool) {
        require(registeredUsers[msg.sender], "User not registered");
        
        // Simular depósito
        encryptedBalances[msg.sender] = encryptedAmount;
        publicBalances[msg.sender] += amount;
        
        return true;
    }
    
    function withdrawToERC20(
        uint256 amount,
        bytes32 encryptedAmount,
        bytes calldata zkProof
    ) external returns (bool) {
        require(registeredUsers[msg.sender], "User not registered");
        
        // Simular retiro
        publicBalances[msg.sender] = amount;
        
        return true;
    }
    
    function getEncryptedBalance(address user) external view returns (bytes32) {
        return encryptedBalances[user];
    }
    
    function isRegistered(address user) external view returns (bool) {
        return registeredUsers[user];
    }
    
    // Funciones de testing
    function mockRegisterUser(address user) external {
        registeredUsers[user] = true;
    }
    
    function mockUnregisterUser(address user) external {
        registeredUsers[user] = false;
    }
    
    function mockSetEncryptedBalance(address user, bytes32 balance) external {
        encryptedBalances[user] = balance;
    }
    
    function getPublicBalance(address user) external view returns (uint256) {
        return publicBalances[user];
    }
}
