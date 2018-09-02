import { EOL } from 'os';
import * as path from 'path';
import * as fs from 'fs';

export function updatePackage(appPath: string) {
  const appPackage = require(path.join(appPath, 'package.json'));
  appPackage.dependencies = appPackage.dependencies || {};

  appPackage.scripts = {
    start: 'solon-scripts start',
    build: 'solon-scripts build',
    deploy: 'solon-scripts deploy',
    clean: 'solon-scripts clean',
    lint: 'solon-scripts lint',
    eject: 'solon-script eject',
    test: 'solon-scripts test --env=jsdom',
  };

  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + EOL);
}
  