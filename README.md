# [DApp Stack](https://dapp-stack.org) &middot; [![CircleCI](https://circleci.com/gh/Dapp-Stack/Dapp-Stack.svg?style=svg)](https://circleci.com/gh/Dapp-Stack/Dapp-Stack) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Dapp-Stack/Dapp-Stack/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://dapp-stack.org/docs/how-to-contribute.html#your-first-pull-request)

DApp Stack is a JavaScript toolkit to develop DApp with ease

* **Convention over Configuration:** DApp Stack makes it painless to create DApp allowing you to go from zero to development
in less time that you would expect, the only thing we require is that you have node.js LTS installed on your system. We kept the
configuration to a minimum and if you need to change it, it will be very simple and well documented.
* **Compatibility:** You love the web and we love it too. We ensure that DApp Stack is well integrated with your favorite
web framework, if you prefer to develop without any of them, that is fine too.
* **Modularity:** We don't make assumptions about the rest of your technology stack, so you can develop new features using DApp
Stack packages without changing everything. DApp Stack can also be used as a whole if you wish to and we aim to provide full
support of the stack.

[Learn how to use DApp Stack in your own project](https://dapp-stack.org/docs/getting-started.html).

## Installation

DApp Stack has been designed for gradual adoption from the start, and **you can use as little or as much DApp Stack as you need**:

* [Create a New DApp](https://dapp-stack.org/docs/getting-started.html) if you're looking for a powerful JavaScript toolkit.

## Documentation
You can find the DApp Stack documentation [on the website](https://dapp-stack.org/docs).

Check out the [Getting Started](https://dapp-stack.org/docs/getting-started.html) guide for a quick overview.

The documentation is divided into several sections:

* [Tutorial](https://dapp-stack.org/tutorial/tutorial.html)
* [Main Concepts](https://dapp-stack.org/docs/getting-started.html)
* [Advanced Guides](https://dapp-stack.org/docs/extra-commands.html)
* [Contributing Guide](https://dapp-stack.org/docs/how-to-contribute.html)

You can improve it by sending pull requests to [this repository](https://github.com/Dapp-Stack/Dapp-Stack).

## Examples

We have several examples [on the website](https://dapp-stack.org/). Here is the first one to get you started:

Using NPM:

```sh
mkdir my-dapp
cd my-dapp
npx dapp-stack
npm install
npm run das start
```

or using yarn:

```sh
mkdir my-dapp
cd my-dapp
npx dapp-stack
yarn install
yarn das start
```

This example will create a simple DApp with a very simple contract and start the development mode.

You'll notice that you didn't have to download any third parties like geth or ganache. We do everything for you.

## Roadmap for V1.0.0

Those are the minimum requirements before releasing the v1.0.0:

* [X] Support [vue.js](https://vuejs.org)
* [X] Support [angular](https://angular.io)
* [X] Support [next.js](https://nextjs.org)
* [ ] Debugger
* [X] Code coverage
* [X] Vyper

## Contributing

The main purpose of this repository is to continue to evolve DApp Stack core, making it faster and easier to use. Development of DApp Stack happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving DApp Stack.

### [Code of Conduct](./CODE_OF_CONDUCT.md)

We have adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](https://dapp-stack.org/contributing/how-to-contribute.html)

Read our [contributing guide](https://dapp-stack.org/contributing/how-to-contribute.html) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to DApp Stack.

### Good First Issues

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/Dapp-Stack/Dapp-Stack/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. This is a great place to get started.

### License

DApp Stack is [MIT licensed](./LICENSE).

### Security

Remember a DApp is backend code running on a decentralized peer-to-peer network so it is up to you to ensure your data is secure.
