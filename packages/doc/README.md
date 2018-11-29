# `@dapp-stack/doc`

This package allows you to generate markdown documentation for your solidity contracts.

## Installation

```sh
# Yarn
yarn add @dapp-stack/doc

# NPM
npm install @dapp-stack/doc
```

## Usage

Required directories:

```sh
my-dapp
└── contracts
    └── src
```

The  output will be in `my-dapp/contracts/doc`

```js
import * as doc from "@dapp-stack/doc";

doc.runAll(["SimpleStorage.sol"])

doc.run("/code/simple-react/contracts/src/SimpleStorage.sol")
```

If you call the function `doc.runAll` without any arguments,
we will try to fetch the list contracts to compile from
the environment file at:

`environments/[DAPP_ENV].js`

See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more detail.

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

