import { EOL } from 'os';

const defaultBrowsers = {
  development: ['chrome', 'firefox', 'edge'].map(
    browser => `last 2 ${browser} versions`
  ),
  production: ['>0.25%', 'not op_mini all', 'ie 11'],
};

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

  appPackage.browserslist = defaultBrowsers;

  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + EOL);
}
  