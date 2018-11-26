# Dapp Stack umbrella repository

[![CircleCI](https://circleci.com/gh/Dapp-Stack/Dapp-Stack.svg?style=svg)](https://circleci.com/gh/Dapp-Stack/Dapp-Stack)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Dapp-Stack/Dapp-Stack/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Dapp-Stack/Dapp-Stack/compare)

### Install dependencies

Make sure you are using Yarn. To install using brew:

```bash
brew install yarn
```

Then install dependencies

```bash
yarn install
```

### Build

To build all packages:

```bash
yarn build
```

To build a specific package:

```bash
PKG=@dapp-stack/connect yarn build
```

### Clean

Clean all packages:

```bash
yarn clean
```

Clean a specific package

```bash
PKG=@dapp-stack/connect yarn clean
```

### Rebuild

To re-build (clean & build) all packages:

```bash
yarn rebuild
```

To re-build (clean & build) a specific package & it's deps:

```bash
PKG=@dapp-stack/connect yarn rebuild
```

### Lint

Lint all packages:

```bash
yarn lint
```

Lint a specific package:

```bash
PKG=@dapp-stack/connect yarn clean
```
