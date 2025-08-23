// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Authorization {
    address public owner;
    
    // Mapeo para verificar si una dirección está autorizada
    mapping(address => bool) public authorizedUsers;

    // Eventos
    event UserAuthorized(address indexed user, bool isAuthorized);
    
    constructor() {
        owner = msg.sender; // El que despliega el contrato es el dueño
        authorizedUsers[msg.sender] = true; // El dueño está autorizado por defecto
    }

    // Modificador para verificar que el remitente es el propietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede realizar esta accion");
        _;
    }

    // Modificador para verificar usuarios autorizados
    modifier onlyAuthorized() {
        require(
            msg.sender == owner || authorizedUsers[msg.sender],
            "No autorizado"
        );
        _;
    }

    // Función para autorizar/desautorizar usuarios (solo el dueño)
    function setUserAuthorization(address user, bool _isAuthorized) public onlyOwner {
        authorizedUsers[user] = _isAuthorized;
        emit UserAuthorized(user, _isAuthorized);
    }

    // Función para verificar si una dirección está autorizada
    function isAuthorized(address _address) public view returns (bool) {
        return _address == owner || authorizedUsers[_address];
    }
    
    // Función para que el propietario pueda retirar fondos
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Función para recibir pagos
    receive() external payable {}
}
