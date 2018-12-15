const chai = require('chai');
const { setup } = require('@dapp-stack/test');

const { expect } = chai;

describe('SimpleStorage', () => {
  let simpleStorage;

  before(async () => {
    await setup(async deployer => {
      simpleStorage = await deployer.deploy('SimpleStorage');
    })
  });

  it('allow to change the value', async () => {
    await simpleStorage.set("hello");
    const value = await simpleStorage.get();
    if (!process.env.COVERAGE) {
      expect(value).to.eq("hello");
    }
  });
});