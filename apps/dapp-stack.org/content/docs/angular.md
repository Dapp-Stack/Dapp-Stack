---
id: angular
title: Angular instalation
permalink: docs/angular.html
prev: create-react-app.html
next: vue.html
---

In order to get started with angular, you can do the following based on the method you prefer:

### npx

```bash
npx @angular/cli new my-dapp
cd my-dapp
npx create-dapp-stack
npm install
```

If you use npm 5.1 or earlier, you can't use npx. Instead, install dapp-stack globally:

```bash
npm install -g @angular/cli
npm install -g create-dapp-stack
```

Now you can run:

```bash
ng new my-dapp
cd my-dapp
create-dapp-stack
npm install
```

It will create a directory called my-dapp inside the current folder.
Inside that directory, it will generate the initial project structure:

```bash
my-dapp
├── README.md
├── angular.json
├── e2e
├── node_modules
├── package.json
├── .gitignore
│── src
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
