# create-dapp-stack

Create dapp with no configuration

DApp Stack works on macOS, Windows, and Linux.  

If something doesn’t work, please [file an issue](https://github.com/Dapp-Stack/Dapp-Stack/issues/new?template=bug_report.md).

## Quick Overview

```sh
mkdir my-dapp
cd my-dapp
npx create-dapp-stack
npm install
npm run das start
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

### Get Started Immediately

You **don’t** need to install or configure tools like Geth or IPFS.  

They are pre-configured and hidden so that you can focus on the code.

Just create a project, and you’re good to go.

## Creating an App

**You’ll need to have Node 8.10.0 or later on your local development machine** (but it’s not required on the server). You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to easily switch Node versions between different projects.

To create a new dapp, you may choose one of the following methods:

### npx

```sh
mkdir my-dapp
cd my-dapp
npx create-dapp-stack
npm install
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

### npm

```sh
mkdir my-dapp
cd my-dapp
npm init dapp-stack
npm install
```

_`npm init <initializer>` is available in npm 6+_

### Yarn

```sh
mkdir my-dapp
cd my-dapp
yarn create dapp-stack
yarn install
```

_`yarn create` is available in Yarn 0.25+_

It will create a directory called `my-dapp` inside the current folder.  

Inside that directory, it will generate the initial project structure:

```sh
my-dapp
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── environments
│   ├── local.js
│   └── test.js
└── contracts
    ├── src
    |   └── SimpleStorage.sol
    └── tests
        └── SimpleStorageTest.js
```

No configuration or complicated folder structures, just the files you need to build your dapp.  

Inside the newly created project, you can run some built-in commands:

### `npm run  das start` or `yarn das start`

Runs the app in development mode.  

### `npm run  das test` or `yarn das test`

Runs the test.  
