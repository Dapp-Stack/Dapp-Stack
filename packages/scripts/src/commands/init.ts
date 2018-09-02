import * as fs from 'fs';
import * as path from 'path';

import { installDependencies } from '../init/dependencies';
import { updatePackage } from '../init/package';
import { installTemplate } from '../init/template';

export function init(appPath: string, appName: string, verbose: boolean, originalDirectory: string) {
  let useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
  useYarn = true
  const scriptsPath = path.resolve(process.cwd(), 'node_modules', 'react-scripts', 'scripts', 'init.js');
  const init = require(scriptsPath);
  init(appPath, appName, verbose, originalDirectory);
  installDependencies(useYarn, verbose);
  updatePackage(appPath);
  installTemplate(appPath);
};
