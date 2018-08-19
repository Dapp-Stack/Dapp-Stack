# Analysis results for /solidity/src/Wallet/MultiSigWallet.sol

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `getOwners()`
- PC address: 1358

### Description

A possible integer overflow exists in the function `getOwners()`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:273

### Code

```
function getOwners()
    public
    constant
    returns (address[])
  {
    return owners;
  }
```

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `getTransactionIds(uint256,uint256,bool,bool)`
- PC address: 1522

### Description

A possible integer overflow exists in the function `getTransactionIds(uint256,uint256,bool,bool)`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:299

### Code

```
function getTransactionIds(uint from, uint to, bool pending, bool executed)
    public
    constant
    returns (uint[] _transactionIds)
  {
    uint[] memory transactionIdsTemp = new uint[](transactionCount);
    uint count = 0;
    uint i;
    for (i=0; i<transactionCount; i++)
      if (   pending && !transactions[i].executed
          || executed && transactions[i].executed)
      {
        transactionIdsTemp[count] = i;
        count += 1;
      }
    _transactionIds = new uint[](to - from);
    for (i=from; i<to; i++)
      _transactionIds[i - from] = transactionIdsTemp[i];
  }
```

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `getConfirmations(uint256)`
- PC address: 1652

### Description

A possible integer overflow exists in the function `getConfirmations(uint256)`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:281

### Code

```
function getConfirmations(uint transactionId)
    public
    constant
    returns (address[] _confirmations)
  {
    address[] memory confirmationsTemp = new address[](owners.length);
    uint count = 0;
    uint i;
    for (i=0; i<owners.length; i++)
      if (confirmations[transactionId][owners[i]]) {
        confirmationsTemp[count] = owners[i];
        count += 1;
      }
    _confirmations = new address[](count);
    for (i=0; i<count; i++)
      _confirmations[i] = confirmationsTemp[i];
  }
```

## Exception state

- Type: Informational
- Contract: MultiSigWallet
- Function name: `_function_0x025e7c27`
- PC address: 2249

### Description

A reachable exception (opcode 0xfe) has been detected. This can be caused by type errors, division by zero, out-of-bounds array access, or assert violations. This is acceptable in most situations. Note however that `assert()` should only be used to check invariants. Use `require()` for regular input checking.
In file: /solidity/src/Wallet/MultiSigWallet.sol:20

### Code

```
address[] public owners
```

## Integer Underflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `removeOwner(address)`
- PC address: 2548

### Description

A possible integer underflow exists in the function `removeOwner(address)`.
The subtraction may result in a value < 0.
In file: /solidity/src/Wallet/MultiSigWallet.sol:118

### Code

```
owners.length - 1
```

## Exception state

- Type: Informational
- Contract: MultiSigWallet
- Function name: `removeOwner(address)`
- PC address: 2592

### Description

A reachable exception (opcode 0xfe) has been detected. This can be caused by type errors, division by zero, out-of-bounds array access, or assert violations. This is acceptable in most situations. Note however that `assert()` should only be used to check invariants. Use `require()` for regular input checking.
In file: /solidity/src/Wallet/MultiSigWallet.sol:119

### Code

```
owners[i]
```

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `addOwner(address)`
- PC address: 3807

### Description

A possible integer overflow exists in the function `addOwner(address)`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:105

### Code

```
owners.length + 1
```

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `getOwners()`
- PC address: 4849

### Description

A possible integer overflow exists in the function `getOwners()`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:278

### Code

```
return owners
```

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `getOwners()`
- PC address: 4851

### Description

A possible integer overflow exists in the function `getOwners()`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:278

### Code

```
return owners
```

## Integer Underflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `getTransactionIds(uint256,uint256,bool,bool)`
- PC address: 5177

### Description

A possible integer underflow exists in the function `getTransactionIds(uint256,uint256,bool,bool)`.
The subtraction may result in a value < 0.
In file: /solidity/src/Wallet/MultiSigWallet.sol:314

### Code

```
to - from
```

## Exception state

- Type: Informational
- Contract: MultiSigWallet
- Function name: `getTransactionIds(uint256,uint256,bool,bool)`
- PC address: 5251

### Description

A reachable exception (opcode 0xfe) has been detected. This can be caused by type errors, division by zero, out-of-bounds array access, or assert violations. This is acceptable in most situations. Note however that `assert()` should only be used to check invariants. Use `require()` for regular input checking.
In file: /solidity/src/Wallet/MultiSigWallet.sol:316

### Code

```
transactionIdsTemp[i]
```

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `removeOwner(address)`
- PC address: 8472

### Description

A possible integer overflow exists in the function `removeOwner(address)`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:3

### Code

```
contract MultiSigWallet {

  event Confirmation(address indexed sender, uint indexed transactionId);
  event Revocation(address indexed sender, uint indexed transactionId);
  event Submission(uint indexed transactionId);
  event Execution(uint indexed transactionId);
  event ExecutionFailure(uint indexed transactionId);
  event Deposit(address indexed sender, uint value);
  event OwnerAddition(address indexed owner);
  event OwnerRemoval(address indexed owner);
  event RequirementChange(uint required);

  uint constant public MAX_OWNER_COUNT = 50;

  mapping (uint => Transaction) public transactions;
  mapping (uint => mapping (address => bool)) public confirmations;
  mapping (address => bool) public isOwner;
  address[] public owners;
  uint public required;
  uint public transactionCount;

  struct Transaction {
    address destination;
    uint value;
    bytes data;
    bool executed;
  }

  modifier onlyWallet() {
    require(msg.sender == address(this));
    _;
  }

  modifier ownerDoesNotExist(address owner) {
    require(!isOwner[owner]);
    _;
  }

  modifier ownerExists(address owner) {
    require(isOwner[owner]);
    _;
  }

  modifier transactionExists(uint transactionId) {
    require(transactions[transactionId].destination != 0);
    _;
  }

  modifier confirmed(uint transactionId, address owner) {
    require(confirmations[transactionId][owner]);
    _;
  }

  modifier notConfirmed(uint transactionId, address owner) {
    require(!confirmations[transactionId][owner]);
    _;
  }

  modifier notExecuted(uint transactionId) {
    require(!transactions[transactionId].executed);
    _;
  }

  modifier notNull(address _address) {
    require(_address != 0);
    _;
  }

  modifier validRequirement(uint ownerCount, uint _required) {
    require(ownerCount <= MAX_OWNER_COUNT
      && _required <= ownerCount
      && _required != 0
      && ownerCount != 0);
    _;
  }

  function()
    public
    payable
  {
    if (msg.value > 0)
      emit Deposit(msg.sender, msg.value);
  }


  constructor(address[] _owners, uint _required)
    public
    validRequirement(_owners.length, _required)
  {
    for (uint i=0; i<_owners.length; i++) {
      require(!isOwner[_owners[i]] && _owners[i] != 0);
      isOwner[_owners[i]] = true;
    }
    owners = _owners;
    required = _required;
  }

  function addOwner(address owner)
    public
    onlyWallet
    ownerDoesNotExist(owner)
    notNull(owner)
    validRequirement(owners.length + 1, required)
  {
    isOwner[owner] = true;
    owners.push(owner);
    emit OwnerAddition(owner);
  }

  function removeOwner(address owner)
    public
    onlyWallet
    ownerExists(owner)
  {
    isOwner[owner] = false;
    for (uint i=0; i<owners.length - 1; i++)
      if (owners[i] == owner) {
        owners[i] = owners[owners.length - 1];
        break;
      }
    owners.length -= 1;
    if (required > owners.length)
      changeRequirement(owners.length);
    emit OwnerRemoval(owner);
  }

  function replaceOwner(address owner, address newOwner)
    public
    onlyWallet
    ownerExists(owner)
    ownerDoesNotExist(newOwner)
  {
    for (uint i=0; i<owners.length; i++)
      if (owners[i] == owner) {
        owners[i] = newOwner;
        break;
      }
    isOwner[owner] = false;
    isOwner[newOwner] = true;
    emit OwnerRemoval(owner);
    emit OwnerAddition(newOwner);
  }

  function changeRequirement(uint _required)
    public
    onlyWallet
    validRequirement(owners.length, _required)
  {
    required = _required;
    emit RequirementChange(_required);
  }

  function submitTransaction(address destination, uint value, bytes data)
    public
    returns (uint transactionId)
  {
    transactionId = addTransaction(destination, value, data);
    confirmTransaction(transactionId);
  }

  function confirmTransaction(uint transactionId)
    public
    ownerExists(msg.sender)
    transactionExists(transactionId)
    notConfirmed(transactionId, msg.sender)
  {
    confirmations[transactionId][msg.sender] = true;
    emit Confirmation(msg.sender, transactionId);
    executeTransaction(transactionId);
  }

  function revokeConfirmation(uint transactionId)
    public
    ownerExists(msg.sender)
    confirmed(transactionId, msg.sender)
    notExecuted(transactionId)
  {
    confirmations[transactionId][msg.sender] = false;
    emit Revocation(msg.sender, transactionId);
  }

  function executeTransaction(uint transactionId)
    public
    ownerExists(msg.sender)
    confirmed(transactionId, msg.sender)
    notExecuted(transactionId)
  {
    if (isConfirmed(transactionId)) {
      Transaction storage txn = transactions[transactionId];
      txn.executed = true;
      if (external_call(txn.destination, txn.value, txn.data.length, txn.data))
        emit Execution(transactionId);
      else {
        emit ExecutionFailure(transactionId);
        txn.executed = false;
      }
    }
  }

  function external_call(address destination, uint value, uint dataLength, bytes data) private returns (bool) {
    bool result;
    assembly {
      let x := mload(0x40)   // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
      let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
      result := call(
        sub(gas, 34710),   // 34710 is the value that solidity is currently emitting
                           // It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
                           // callNewAccountGas (25000, in case the destination address does not exist and needs creating)
        destination,
        value,
        d,
        dataLength,        // Size of the input (in bytes) - this is what fixes the padding problem
        x,
        0                  // Output is ignored, therefore the output size is zero
      )
    }
    return result;
  }

  function isConfirmed(uint transactionId)
    public
    constant
    returns (bool)
  {
    uint count = 0;
    for (uint i=0; i<owners.length; i++) {
      if (confirmations[transactionId][owners[i]])
        count += 1;
      if (count == required)
        return true;
    }
  }

  function addTransaction(address destination, uint value, bytes data)
    internal
    notNull(destination)
    returns (uint transactionId)
  {
    transactionId = transactionCount;
    transactions[transactionId] = Transaction({
      destination: destination,
      value: value,
      data: data,
      executed: false
    });
    transactionCount += 1;
    emit Submission(transactionId);
  }

  function getConfirmationCount(uint transactionId)
    public
    constant
    returns (uint count)
  {
    for (uint i=0; i<owners.length; i++)
      if (confirmations[transactionId][owners[i]])
          count += 1;
  }

  function getTransactionCount(bool pending, bool executed)
    public
    constant
    returns (uint count)
  {
    for (uint i=0; i<transactionCount; i++)
        if (   pending && !transactions[i].executed
            || executed && transactions[i].executed)
            count += 1;
  }

  function getOwners()
    public
    constant
    returns (address[])
  {
    return owners;
  }

  function getConfirmations(uint transactionId)
    public
    constant
    returns (address[] _confirmations)
  {
    address[] memory confirmationsTemp = new address[](owners.length);
    uint count = 0;
    uint i;
    for (i=0; i<owners.length; i++)
      if (confirmations[transactionId][owners[i]]) {
        confirmationsTemp[count] = owners[i];
        count += 1;
      }
    _confirmations = new address[](count);
    for (i=0; i<count; i++)
      _confirmations[i] = confirmationsTemp[i];
  }

  function getTransactionIds(uint from, uint to, bool pending, bool executed)
    public
    constant
    returns (uint[] _transactionIds)
  {
    uint[] memory transactionIdsTemp = new uint[](transactionCount);
    uint count = 0;
    uint i;
    for (i=0; i<transactionCount; i++)
      if (   pending && !transactions[i].executed
          || executed && transactions[i].executed)
      {
        transactionIdsTemp[count] = i;
        count += 1;
      }
    _transactionIds = new uint[](to - from);
    for (i=from; i<to; i++)
      _transactionIds[i - from] = transactionIdsTemp[i];
  }
}
```

## Integer Overflow

- Type: Warning
- Contract: MultiSigWallet
- Function name: `removeOwner(address)`
- PC address: 8474

### Description

A possible integer overflow exists in the function `removeOwner(address)`.
The addition or multiplication may result in a value higher than the maximum representable integer.
In file: /solidity/src/Wallet/MultiSigWallet.sol:3

### Code

```
contract MultiSigWallet {

  event Confirmation(address indexed sender, uint indexed transactionId);
  event Revocation(address indexed sender, uint indexed transactionId);
  event Submission(uint indexed transactionId);
  event Execution(uint indexed transactionId);
  event ExecutionFailure(uint indexed transactionId);
  event Deposit(address indexed sender, uint value);
  event OwnerAddition(address indexed owner);
  event OwnerRemoval(address indexed owner);
  event RequirementChange(uint required);

  uint constant public MAX_OWNER_COUNT = 50;

  mapping (uint => Transaction) public transactions;
  mapping (uint => mapping (address => bool)) public confirmations;
  mapping (address => bool) public isOwner;
  address[] public owners;
  uint public required;
  uint public transactionCount;

  struct Transaction {
    address destination;
    uint value;
    bytes data;
    bool executed;
  }

  modifier onlyWallet() {
    require(msg.sender == address(this));
    _;
  }

  modifier ownerDoesNotExist(address owner) {
    require(!isOwner[owner]);
    _;
  }

  modifier ownerExists(address owner) {
    require(isOwner[owner]);
    _;
  }

  modifier transactionExists(uint transactionId) {
    require(transactions[transactionId].destination != 0);
    _;
  }

  modifier confirmed(uint transactionId, address owner) {
    require(confirmations[transactionId][owner]);
    _;
  }

  modifier notConfirmed(uint transactionId, address owner) {
    require(!confirmations[transactionId][owner]);
    _;
  }

  modifier notExecuted(uint transactionId) {
    require(!transactions[transactionId].executed);
    _;
  }

  modifier notNull(address _address) {
    require(_address != 0);
    _;
  }

  modifier validRequirement(uint ownerCount, uint _required) {
    require(ownerCount <= MAX_OWNER_COUNT
      && _required <= ownerCount
      && _required != 0
      && ownerCount != 0);
    _;
  }

  function()
    public
    payable
  {
    if (msg.value > 0)
      emit Deposit(msg.sender, msg.value);
  }


  constructor(address[] _owners, uint _required)
    public
    validRequirement(_owners.length, _required)
  {
    for (uint i=0; i<_owners.length; i++) {
      require(!isOwner[_owners[i]] && _owners[i] != 0);
      isOwner[_owners[i]] = true;
    }
    owners = _owners;
    required = _required;
  }

  function addOwner(address owner)
    public
    onlyWallet
    ownerDoesNotExist(owner)
    notNull(owner)
    validRequirement(owners.length + 1, required)
  {
    isOwner[owner] = true;
    owners.push(owner);
    emit OwnerAddition(owner);
  }

  function removeOwner(address owner)
    public
    onlyWallet
    ownerExists(owner)
  {
    isOwner[owner] = false;
    for (uint i=0; i<owners.length - 1; i++)
      if (owners[i] == owner) {
        owners[i] = owners[owners.length - 1];
        break;
      }
    owners.length -= 1;
    if (required > owners.length)
      changeRequirement(owners.length);
    emit OwnerRemoval(owner);
  }

  function replaceOwner(address owner, address newOwner)
    public
    onlyWallet
    ownerExists(owner)
    ownerDoesNotExist(newOwner)
  {
    for (uint i=0; i<owners.length; i++)
      if (owners[i] == owner) {
        owners[i] = newOwner;
        break;
      }
    isOwner[owner] = false;
    isOwner[newOwner] = true;
    emit OwnerRemoval(owner);
    emit OwnerAddition(newOwner);
  }

  function changeRequirement(uint _required)
    public
    onlyWallet
    validRequirement(owners.length, _required)
  {
    required = _required;
    emit RequirementChange(_required);
  }

  function submitTransaction(address destination, uint value, bytes data)
    public
    returns (uint transactionId)
  {
    transactionId = addTransaction(destination, value, data);
    confirmTransaction(transactionId);
  }

  function confirmTransaction(uint transactionId)
    public
    ownerExists(msg.sender)
    transactionExists(transactionId)
    notConfirmed(transactionId, msg.sender)
  {
    confirmations[transactionId][msg.sender] = true;
    emit Confirmation(msg.sender, transactionId);
    executeTransaction(transactionId);
  }

  function revokeConfirmation(uint transactionId)
    public
    ownerExists(msg.sender)
    confirmed(transactionId, msg.sender)
    notExecuted(transactionId)
  {
    confirmations[transactionId][msg.sender] = false;
    emit Revocation(msg.sender, transactionId);
  }

  function executeTransaction(uint transactionId)
    public
    ownerExists(msg.sender)
    confirmed(transactionId, msg.sender)
    notExecuted(transactionId)
  {
    if (isConfirmed(transactionId)) {
      Transaction storage txn = transactions[transactionId];
      txn.executed = true;
      if (external_call(txn.destination, txn.value, txn.data.length, txn.data))
        emit Execution(transactionId);
      else {
        emit ExecutionFailure(transactionId);
        txn.executed = false;
      }
    }
  }

  function external_call(address destination, uint value, uint dataLength, bytes data) private returns (bool) {
    bool result;
    assembly {
      let x := mload(0x40)   // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
      let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
      result := call(
        sub(gas, 34710),   // 34710 is the value that solidity is currently emitting
                           // It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
                           // callNewAccountGas (25000, in case the destination address does not exist and needs creating)
        destination,
        value,
        d,
        dataLength,        // Size of the input (in bytes) - this is what fixes the padding problem
        x,
        0                  // Output is ignored, therefore the output size is zero
      )
    }
    return result;
  }

  function isConfirmed(uint transactionId)
    public
    constant
    returns (bool)
  {
    uint count = 0;
    for (uint i=0; i<owners.length; i++) {
      if (confirmations[transactionId][owners[i]])
        count += 1;
      if (count == required)
        return true;
    }
  }

  function addTransaction(address destination, uint value, bytes data)
    internal
    notNull(destination)
    returns (uint transactionId)
  {
    transactionId = transactionCount;
    transactions[transactionId] = Transaction({
      destination: destination,
      value: value,
      data: data,
      executed: false
    });
    transactionCount += 1;
    emit Submission(transactionId);
  }

  function getConfirmationCount(uint transactionId)
    public
    constant
    returns (uint count)
  {
    for (uint i=0; i<owners.length; i++)
      if (confirmations[transactionId][owners[i]])
          count += 1;
  }

  function getTransactionCount(bool pending, bool executed)
    public
    constant
    returns (uint count)
  {
    for (uint i=0; i<transactionCount; i++)
        if (   pending && !transactions[i].executed
            || executed && transactions[i].executed)
            count += 1;
  }

  function getOwners()
    public
    constant
    returns (address[])
  {
    return owners;
  }

  function getConfirmations(uint transactionId)
    public
    constant
    returns (address[] _confirmations)
  {
    address[] memory confirmationsTemp = new address[](owners.length);
    uint count = 0;
    uint i;
    for (i=0; i<owners.length; i++)
      if (confirmations[transactionId][owners[i]]) {
        confirmationsTemp[count] = owners[i];
        count += 1;
      }
    _confirmations = new address[](count);
    for (i=0; i<count; i++)
      _confirmations[i] = confirmationsTemp[i];
  }

  function getTransactionIds(uint from, uint to, bool pending, bool executed)
    public
    constant
    returns (uint[] _transactionIds)
  {
    uint[] memory transactionIdsTemp = new uint[](transactionCount);
    uint count = 0;
    uint i;
    for (i=0; i<transactionCount; i++)
      if (   pending && !transactions[i].executed
          || executed && transactions[i].executed)
      {
        transactionIdsTemp[count] = i;
        count += 1;
      }
    _transactionIds = new uint[](to - from);
    for (i=from; i<to; i++)
      _transactionIds[i - from] = transactionIdsTemp[i];
  }
}
```

