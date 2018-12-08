---
id: deploy
title: Deploy
permalink: docs/deploy.html
layout: docs
---

The command to run the deploy:

Using npm
```bash
npm run das deploy
```

Using yarn
```bash
yarn das deploy
```

This command is exactly the same as the `build` command, however at the
end, the assets will also be deployed.

Usually you will have a dedicated environment file such as `mainnet`
with all your production configuration.
