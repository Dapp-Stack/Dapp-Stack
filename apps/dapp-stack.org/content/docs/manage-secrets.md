---
id: manage-secrets
title: Manage Secrets
permalink: docs/manage-secrets.html
layout: docs
---

As you may have seen in the [environemnts section](./environments.html), these commented lines of code
are present by default:

```js
const secrets = require("@dapp-stack/secrets");

// const decryptedSecrets = secrets.decrypt();
// const mnemonic =  decryptedSecrets.rinkeby.mnemonic;
```

You may not want to use this package and use env variable and that is fine as soon as
you never commit any password, mnemonic or api key.

However if you want to use our secrets packages, you can process as follow:

### Setup the secrets

```bash
yarn secrets setup
```

That will for effect to create and encrypted file `secrets.json.enc` and a master key `master.key`
The only way to read the secrets is to know the master key.

As such it is ok to share the `secrets.json.enc`. However never share the `master.key` file as everyone
with this file can decrypt your secrets.

### Show the secrets:

```bash
yarn secrets show
```

### Edit the secrets:

```bash
yarn secrets edit
```

This will open your editor, the one configured with EDITOR, with the decrypted secrets.
So you will then be able to change them.
As soon as you exit the editor, the secrets will be re-encrypted.
