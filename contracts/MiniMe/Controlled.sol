pragma solidity ^0.4.24;

contract Controlled {
  modifier onlyController {
    require(msg.sender == controller);
    _;
  }

  address public controller;

  constructor() public {
    controller = msg.sender;
  }

  function changeController(address _newController) public onlyController {
    controller = _newController;
  }
}
