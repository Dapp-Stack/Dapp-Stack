const chai = require('chai');
const { setup } = require('@solon/test');

const { expect } = chai;
const tester = setup();

describe('SimpleStorage', () => {
  let simpleStorage;
  const initialValue = '10';

  beforeEach(async () => {
    simpleStorage = await tester.deploy("SimpleStorage.sol", { args: [initialValue] });
  });

  it('sets default value', async () => {
    expect(await simpleStorage.methods.get().call()).to.eq(initialValue);
  });

  it('allow to change the value', async () => {
    await simpleStorage.methods.set(20).send({from: accounts[0]});
    expect(await simpleStorage.methods.get().call()).to.eq('20');
  });
});
