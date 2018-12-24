# `@dapp-stack/scripts`

This package is the best and easiest way to interact with
the dapp-stack ecosystem.

It manages everything you want in order to develop and deploy a dapp.

## Installation

```sh
# Yarn
yarn add @dapp-stack/secrets

# NPM
npm install @dapp-stack/secrets
```

## Usage

Add it to your scripts list in `package.json`

```js
scripts: {
  "das": "dapp-stack-scripts"
}
```

## List of command

### Help

```sh
# Yarn
yarn add @dapp-stack/secrets

# NPM
npm install @dapp-stack/secrets
```

### Start

```sh
# Yarn
yarn das start

# NPM
npm run das build
```

Runs the dapp in the development mode.
We will perform the following operations:

- Start an ethererum node or connect to it
- Start an IPFS daemon
- Compile the contracts
- Deploy the contract
- Start a Web development server (if configured)
- Open a browser

If any change happens to the contract, we will then recompile it
and redeploy it.

If any change happens to the frontend, we will then recompile it
and refresh the browser.

### Stop

```sh
# Yarn
yarn das stop

# NPM
npm run das stop
```

This command will stop external services such as the ethereum node or ipfs daemon.

### Build

```sh
# Yarn
yarn das build

# NPM
npm run das build
```

If you want to have the same executable as the one we would deployed you can run the
build command
We will then execute the following operations:

- Start an ethererum node or connect to it
- Start an IPFS daemon
- Compile the contracts
- Deploy the contracts
- Build the assets

### Test

```sh
# Yarn
yarn das test

# NPM
npm run das test
```

You can run this command in order to run the test, we will first compile the contracts.
You can read more about it there:
[https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/test](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/test)

### Deploy

```sh
# Yarn
yarn das deploy

# NPM
npm run das deploy
```

When you are done developing your dapp and feel ready to share it,
you can call this command in order to:

- Start an ethererum node or connect to it
- Start an IPFS daemon
- Compile the contracts
- Deploy the contracts
- Build the assets
- Deploy the assets

### Security

```sh
# Yarn
yarn das security

# NPM
npm run das security
```

This command will run a security check on your command.
You can have read more about it there:
[https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/security](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/security)

### Clean

```sh
# Yarn
yarn das clean

# NPM
npm run das clean
```

This command will clean all the logs and information about local node.

### Console

```sh
# Yarn
yarn das console

# NPM
npm run das console
```

You can run this command in order to start an ethereum console.
That will give you the same benefit as the geth console:
[https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console)

### Debug

```sh
# Yarn
yarn das debug <txHash>

# NPM
npm run das debug <txHash>
```

You can run this command in order to debug an ethereum transaction.
