const chai = require('chai');
const {createMockProvider} = require('../../lib/tester');
const { deploy } = require('../../lib/deployer');
const { getAccounts } = require('../../lib/utils');

const { expect } = chai;

describe('Apps/SimpleStorage', () => {
  let provider;
  let simpleStorage;
  let accounts;
  const initialValue = '10';

  beforeEach(async () => {
    provider = createMockProvider();
    simpleStorage = await deploy("Apps/SimpleStorage.sol", { args: [initialValue] });
    accounts = await getAccounts();
  });

  it('sets default value', async () => {
    expect(await simpleStorage.methods.get().call()).to.eq(initialValue);
  });

  it('allow to change the value', async () => {
    await simpleStorage.methods.set(20).send({from: accounts[0]});
    expect(await simpleStorage.methods.get().call()).to.eq('20');
  });
});
