---
id: extra-commands
title: Extra Commands
permalink: docs/extra-commands.html
layout: docs
---

### Debugger

Using npm
```bash
npm run das debugger <txHash>
```

Using yarn
```bash
yarn das debugger <txHash>
```

This command will start a debugger, in order to see all possible options, you can
press `h` for help.

### Ethereum Console

Using npm
```bash
npm run das console
```

Using yarn
```bash
yarn das console
```

This command will start a geth console, this is the same as [JavaScript Console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console)

### Smart Contracts Security

> Warning: Docker running is required.

Using npm
```bash
npm run das security
```

Using yarn
```bash
yarn das security
```

Check the security of your contract using [mythril-classic](https://github.com/ConsenSys/mythril-classic)

### Smart Contracts Documentation

Using npm
```bash
npm run das doc
```

Using yarn
```bash
yarn das doc
```

Generate a mardown file representing your contract.
Example of output:

### Files Description Table

|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| /DappStack/DappStack/apps/simple-react/contracts/src/SimpleStorage.sol | c38430b580a7b5661c2287d593cf87bc305a9553 |

### Contracts Description Table

|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **SimpleStorage** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | set | Public ❗️ | 🛑  | |
| └ | get | Public ❗️ |   | |

### Legend
|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
