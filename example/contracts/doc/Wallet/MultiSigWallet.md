## Sūrya's Description Report
### Files Description Table

|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| /Users/anthony/code/SolonProject/solon-web/contracts/lib/../src/Wallet/MultiSigWallet.sol | bc9b754ae8bc0e80973a2404dccb8cacb741a11e |

### Contracts Description Table

|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **MultiSigWallet** | Implementation |  |||
| └ | \<Fallback\> | Public ❗️ |  💵 | |
| └ | \<Constructor\> | Public ❗️ | 🛑  | validRequirement |
| └ | addOwner | Public ❗️ | 🛑  | onlyWallet ownerDoesNotExist notNull validRequirement |
| └ | removeOwner | Public ❗️ | 🛑  | onlyWallet ownerExists |
| └ | replaceOwner | Public ❗️ | 🛑  | onlyWallet ownerExists ownerDoesNotExist |
| └ | changeRequirement | Public ❗️ | 🛑  | onlyWallet validRequirement |
| └ | submitTransaction | Public ❗️ | 🛑  | |
| └ | confirmTransaction | Public ❗️ | 🛑  | ownerExists transactionExists notConfirmed |
| └ | revokeConfirmation | Public ❗️ | 🛑  | ownerExists confirmed notExecuted |
| └ | executeTransaction | Public ❗️ | 🛑  | ownerExists confirmed notExecuted |
| └ | external_call | Private 🔐 | 🛑  | |
| └ | isConfirmed | Public ❗️ |   | |
| └ | addTransaction | Internal 🔒 | 🛑  | notNull |
| └ | getConfirmationCount | Public ❗️ |   | |
| └ | getTransactionCount | Public ❗️ |   | |
| └ | getOwners | Public ❗️ |   | |
| └ | getConfirmations | Public ❗️ |   | |
| └ | getTransactionIds | Public ❗️ |   | |

### Legend
|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
