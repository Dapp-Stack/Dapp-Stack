# @dapp-stack/debugger

This package will allow you to debug ethereum transaction.

## Installation

```sh
# Yarn
yarn add @dapp-stack/debugger

# NPM
npm install @dapp-stack/debugger
```

## Usage

Required directories:

```sh
my-dapp
└── contracts
    └── src
```

```js
import * as debug from "@dapp-stack/debugger";

debug.start(txHash)
```

You will be able to perform the following actions:

```js
{
  o: 'step over',
  i: 'step into',
  u: 'step out',
  n: 'step next',
  ';': 'step instruction',
  p: 'print instruction',
  h: 'print the help',
  v: 'print variables and values',
  b: 'add breakpoint',
  B: 'remove breakpoint',
  c: 'continue until breakpoint',
  q: 'quit',
  r: 'reset'
}
```
