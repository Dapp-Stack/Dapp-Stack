---
id: create-react-app
title: Create React app instalation
permalink: docs/create-react-app.html
prev: standalone.html
next: angular.html
---

In order to get started with create-react-app, you can do the following based on the method you prefer:

### npx

```bash
npx create-react-app my-dapp
cd my-dapp
npx create-dapp-stack
npm install
```

If you use npm 5.1 or earlier, you can't use npx. Instead, install dapp-stack globally:

```bash
npm install -g create-react-app
npm install -g create-dapp-stack
```

Now you can run:

```bash
create-react-app my-dapp
cd my-dapp
create-dapp-stack
npm install
```

### npm

```bash
npm init create-react-app my-dapp
cd my-dapp;
npm init dapp-stack
npm install
```

npm init <initializer> is available in npm 6+

### yarn

```bash
yarn create react-app my-dapp
cd my-dapp
yarn create dapp-stack
yarn install
```

yarn create is available in Yarn 0.25+

It will create a directory called my-dapp inside the current folder.
Inside that directory, it will generate the initial project structure:

```bash
my-dapp
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
│── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   └── serviceWorker.js
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
