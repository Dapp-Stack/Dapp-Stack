pragma solidity ^0.4.24;

import "../Lib/Owned.sol";

contract FileStorage is Owned {
  mapping (uint => hash) files;
}
