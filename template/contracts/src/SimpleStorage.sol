pragma solidity ^0.5.0;

contract SimpleStorage {

    uint public storedData;

    event Change(string message, uint newVal);

    constructor(uint initVal) public {
        emit Change("initialized", initVal);
        storedData = initVal;
    }

    function set(uint x) public {
        emit Change("set", x);
        storedData = x;
    }

    function get() public view returns (uint retVal) {
        return storedData;
    }

}
