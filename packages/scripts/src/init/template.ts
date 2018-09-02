import * as fs from 'fs-extra';
import * as path from 'path';

export function installTemplate(appPath: string){
  const ownPackageName = require(path.join(__dirname, '..', 'package.json')).name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const templatePath = path.join(ownPath, 'template');
  fs.copySync(templatePath, appPath);
}