const chai = require('chai');
const { setup } = require('@solon/test');

const { expect } = chai;

describe('SimpleStorage', () => {
  let simpleStorage, tester, accounts;
  const initialValue = '10';

  beforeEach(async () => {
    tester = await setup();
    accounts = tester.accounts();
    simpleStorage = await tester.deploy('SimpleStorage', { args: [initialValue] });
  });

  it('sets default value', async () => {
    expect(await simpleStorage.methods.get().call()).to.eq(initialValue);
  });

  it('allow to change the value', async () => {
    await simpleStorage.methods.set(20).send({from: accounts[0]});
    expect(await simpleStorage.methods.get().call()).to.eq('20');
  });
});
