# @dapp-stack/secrets

Manage your secrets wisely.
This package will allow you to commit the an encrypted secrets file
and access it.

*DO NOT COMMIT YOUR MNEMONIC OR API KEY*

## Installation

```sh
# Yarn
yarn add @dapp-stack/secrets

# NPM
npm install @dapp-stack/secrets
```

In order to access the secrets you must have the
master.key file or setup the environment variable: MASTER_KEY

*NEVER COMMIT THIS FILE OR PUBLISH THE MASTER KEY ANYWHERE*

## Setup

Generate the master key and the encrypted file

```sh
dapp-stack-secrets setup
```

## Edit the secrets

Open the editor and decrypt the file.
The encrypted secrets is saved when the editor is closed

```sh
dapp-stack-secrets edit
```

## Print the secrets

```sh
dapp-stack-secrets show
```

## Access the secrets programmatically

```sh
const secrets = require("@dapp-stack/secrets");

const decryptedSecrets = secrets.decrypt();
```
