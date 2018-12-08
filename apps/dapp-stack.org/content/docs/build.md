---
id: build
title: Build
permalink: docs/build.html
layout: docs
---

The command to run the build:

Using npm
```bash
npm run das build
```

Using yarn
```bash
yarn das build
```

This command is quite similar to the `development` one, however the watcher won't start
and the command will stop at the end of the process.

`build` can be helpful to run in order to make sure everything compile before doing a deploy
for example
