---
id: standalone
title: Standalone instalation
permalink: docs/standalone.html
prev: getting-started.html
next: create-react-app.html
---

In order to get started witout any web framework, if you just want to get started with Smart contracts only
you can do the following based on the method you prefer:

### npx

```sh
mkdir my-dapp
cd my-dapp
npx dapp-stack
npm install
```

If you use npm 5.1 or earlier, you can't use npx. Instead, install dapp-stack globally:

```sh
npm install -g dapp-stack
```

Now you can run:

```sh
mkdir my-dapp
cd my-dapp
dapp-stack
npm install
```

### npm

```sh
mkdir my-dapp
cd my-dapp
npm init dapp-stack
yarn install
```

npm init <initializer> is available in npm 6+

### yarn

```sh
mkdir my-dapp
cd my-dapp
npm init dapp-stack
yarn create dapp-stack
```

yarn create is available in Yarn 0.25+

It will create a directory called my-dapp inside the current folder.
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