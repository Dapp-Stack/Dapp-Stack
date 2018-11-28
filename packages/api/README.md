# `@dapp-stack/api`

This package starts an HTTP api using express.
The exposed port is `55555`.

## Installation

```sh
# Yarn
yarn add @dapp-stack/api

# NPM
npm install @dapp-stack/api
```

## Usage

```js
import * as api from "@dapp-stack/api";

api.start()
```

### Enpoints

* `GET /ping`

It will return a `204` http status code if started.

* `GET /tracker`

It will read the tracker and returns it.