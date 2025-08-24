// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MockRegistrar {
    mapping(address => bytes) private publicKeys;
    mapping(address => bool) private registeredUsers;
    
    event UserRegistered(address indexed user);
    
    function register(bytes calldata publicKey, bytes calldata zkProof) external {
        publicKeys[msg.sender] = publicKey;
        registeredUsers[msg.sender] = true;
        
        emit UserRegistered(msg.sender);
    }
    
    function getPublicKey(address user) external view returns (bytes memory) {
        return publicKeys[user];
    }
    
    function isRegistered(address user) external view returns (bool) {
        return registeredUsers[user];
    }
    
    // Función de testing
    function mockRegisterUser(address user, bytes calldata publicKey) external {
        publicKeys[user] = publicKey;
        registeredUsers[user] = true;
    }
}
