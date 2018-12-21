pragma solidity ^0.5.0;

contract SimpleStorage {

    string public ipfsHash;
    uint x;

    event Change(string message, string ipfsHash);
    event Done(uint x);
    constructor(uint _x) public {
        x = _x;
        emit Done(_x);
    }

    function set(string memory _ipfsHash) public {
        emit Change("set", ipfsHash);
        ipfsHash = _ipfsHash;
    }

    function get() public view returns (string memory) {
        return ipfsHash;
    }

}