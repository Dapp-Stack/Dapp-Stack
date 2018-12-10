---
id: next
title: Next.js instalation
permalink: docs/next.html
prev: vue.html
---

In order to get started with next.js, you can do the following based on the method you prefer:

### npx

```bash
npx create-next-app my-dapp
cd my-dapp
npx create-dapp-stack
npm install
```

If you use npm 5.1 or earlier, you can't use npx. Instead, install dapp-stack globally:

```bash
npm install -g create-next-app
npm install -g create-dapp-stack
```

Now you can run:

```bash
create-next-app my-dapp
cd my-dapp
create-dapp-stack
npm install
```

### npm

```bash
npm init create-next-app my-dapp
cd my-dapp;
npm init dapp-stack
npm install
```

npm init <initializer> is available in npm 6+

### yarn

```bash
yarn create next-app my-dapp
cd my-dapp
yarn create dapp-stack
yarn install
```

yarn create is available in Yarn 0.25+

It will create a directory called my-dapp inside the current folder.

> WARNING: you will have to load the `tracker.json` manually, this file will be located
> in `static` folder and contains addresses and ABI of your deployed contracts.
