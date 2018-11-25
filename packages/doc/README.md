# `@dapp-stack/doc`

This package allows you generate markdown documentation for your solidity contracts

## Installation

```sh
# Yarn
yarn add @dapp-stack/doc

# NPM
npm install @dapp-stack/doc
```

## Usage

Expected directories:
* contracts
* * src
* * doc

### Passing contracts as arguments

```js
import * as doc from "@dapp-stack/doc";

doc.runAll(["SimpleStorage.sol"])

doc.run("/code/simple-react/contracts/src/SimpleStorage.sol")
```

### With environment file

We will read the contracts array from the environment file.
See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more details about it.

```js
import * as doc from "@dapp-stack/doc";

doc.runAll()
```

## Example of output

### Files Description Table

|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| /code/simple-react/contracts/src/SimpleStorage.sol | c38430b580a7b5661c2287d593cf87bc305a9553 |

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

