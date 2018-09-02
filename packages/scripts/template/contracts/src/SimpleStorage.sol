pragma solidity ^0.4.24;

contract SimpleStorage {

    uint public storedData;

    event Change(string message, uint newVal);

    function SimpleStorage(uint initVal) public {
        emit Change("initialized", initVal);
        storedData = initVal;
    }

    function set(uint x) public {
        emit Change("set", x);
        storedData = x;
    }

    function get() public constants returns (uint retVal) {
        return storedData;
    }

}
