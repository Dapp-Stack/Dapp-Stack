pragma solidity ^0.4.24;

import "./CongressStorage.sol";

contract Congress {

  CongressStorage congressStorage;

  constructor(address _congressStorageAddress) public {
    congressStorage = CongressStorage(_congressStorageAddress);
  }

  function register(bytes name) {

  }
}
