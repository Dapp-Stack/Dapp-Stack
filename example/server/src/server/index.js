import express from 'express';

import { APP_NAME, WEB_PORT } from '../config';

const app = express();

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT}.`);
});
