pragma solidity ^0.5.0;

contract SimpleStorage {

    string public ipfsHash;

    event Change(string message, string ipfsHash);

    function set(string memory _ipfsHash) public {
        emit Change("set", ipfsHash);
        ipfsHash = _ipfsHash;
    }

    function get() public view returns (string memory) {
        return ipfsHash;
    }

}