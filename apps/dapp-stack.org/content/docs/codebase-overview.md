---
id: codebase-overview
title: Codebase Overview
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
redirect_from:
  - "contributing/codebase-overview.html"
---

This section will give you an overview of the DApp Stack codebase organization, its conventions, and the implementation.

If you want to [contribute to DApp Stack](/docs/how-to-contribute.html) we hope that this guide will help you feel more comfortable making changes.

We don't necessarily recommend any of these conventions in DApp Stack apps. Many of them exist for historical reasons and might change with time.

### Top-Level Folders

After cloning the [DApp Stacl repository](https://github.com/Dapp-Stack/Dapp-Stack), you will see a few top-level folders in it:

* [`packages`](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/packages) contains metadata (such as `package.json`) and the source code (`src` subdirectory) for all packages in the DApp Stack repository. **If your change is related to the code, the `src` subdirectory of each package is where you'll spend most of your time.**
* [`apps`](https://github.com/Dapp-Stack/Dapp-Stack/tree/master/apps) contains this documentation, the code for the tutorial and the dev-tools.

There are a few other top-level folders but they are mostly used for the tooling and you likely won't ever encounter them when contributing.

### Signale

The DApp Stack codebase uses the `signale` module to display messages to the user:

```js
import { Signale } from 'signale'

const signale = new Signale({scope: 'package'})
signale.success('Hello DApp Stack')
```

### Multiple Packages

DApp Stack is a [monorepo](http://danluu.com/monorepo/). Its repository contains multiple separate packages so that their changes can be coordinated together, and issues live in one place.