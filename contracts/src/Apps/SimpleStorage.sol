pragma solidity ^0.4.24;
contract SimpleStorage {

  uint public storedData;

  event Change(string message, uint newVal);

  function SimpleStorage(uint initVal) {
    emit Change("initialized", initVal);
    storedData = initVal;
  }

  function set(uint x) {
    emit Change("set", x);
    storedData = x;
  }

  function get() constant returns (uint retVal) {
    return storedData;
  }

}
