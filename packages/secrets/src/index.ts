import { Structure } from '@solon/environment';
import * as crypto from 'crypto';
import * as fs from 'fs-extra';

const ALGORITHM = 'aes-256-ctr';

export const edit = () => {
};

export const show = () => {
  const content = decrypt();
  console.log(content);
};

const decrypt = () => {
  const password = getPassword();
  const text = getText();
  const decipher = crypto.createDecipher(ALGORITHM, password);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

const encrypt = (text: string) => {
  const password = getPassword();
  const cipher = crypto.createCipher(ALGORITHM, password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

const getPassword = () => {
  if (fs.existsSync(Structure.masterKey)) {
    return fs.readFileSync(Structure.masterKey, 'utf-8');
  }

  return process.env.MASTER_KEY || '';
};

const getText = () => {
  if (!fs.existsSync(Structure.secrets)) {
    return '';
  }

  return fs.readFileSync(Structure.secrets, 'utf-8');
};
