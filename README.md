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
PKG=@solon/connect yarn build
```

### Clean

Clean all packages:

```bash
yarn clean
```

Clean a specific package

```bash
PKG=@solon/connect yarn clean
```

### Rebuild

To re-build (clean & build) all packages:

```bash
yarn rebuild
```

To re-build (clean & build) a specific package & it's deps:

```bash
PKG=@solon/connect yarn rebuild
```

### Lint

Lint all packages:

```bash
yarn lint
```

Lint a specific package:

```bash
PKG=@solon/connect yarn clean
```
