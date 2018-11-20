const chai = require('chai');
const { setup } = require('@dapp-stack/test');

const { expect } = chai;

describe('SimpleStorage', () => {
  let simpleStorage, tester, accounts;
  const initialValue = '10';

  before(async () => {
    await setup(async deployer => {
      simpleStorage = await deployer.deploy('SimpleStorage', initialValue);
    })
  });

  it('sets default value', async () => {
    expect((await simpleStorage.get()).eq(10)).to.eq(true);
  });

  it('allow to change the value', async () => {
    await simpleStorage.set(20);
    expect((await simpleStorage.get()).eq(20)).to.eq(true);
  });
});