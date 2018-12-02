# `@dapp-stack/web`

Start/Build/Stop the web framework of your choice and deploy your assets.

## Installation

```sh
# Yarn
yarn add @dapp-stack/web

# NPM
npm install @dapp-stack/web
```

## Usage

```js
import * as web from "@dapp-stack/web";

web.start("create-react-react")
web.build("create-react-react")
web.stop("create-react-react")
web.deploy("create-react-react")
```

Currently the only web framework supported is `create-react-react`.
It will delegate all the call to (create-react-app)[https://github.com/facebook/create-react-app]

The only deploy strategy supported is `ipfs`

If you call the function `web.start`, `web.build`, `web.stop` or `web.deploy`
without any arguments, we will try to fetch the web framework or deploy strategy
from the environment file at:

`environments/[DAPP_ENV].js`

See: [Environment](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages/environment)
for more detail.
