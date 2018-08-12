#!/usr/bin/env node

const fs = require("fs");
const Web3 = require('web3');
const contracts = require('../config');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const deploy = async function(contract) {
  let accounts = await web3.eth.getAccounts();
  let gasPrice = await web3.eth.getGasPrice();

  let source = fs.readFileSync(`${__dirname}/../build/${contract.name}/combined.json`);
  let account = contract.account || accounts[0];
  let contractsInfo = JSON.parse(source)["contracts"];

  Object.keys(contractsInfo).forEach((contractName) => {
    let abi = JSON.parse(contractsInfo[contractName].abi);
    let data = '0x' + contractsInfo[contractName].bin;

    let contractClass = new web3.eth.Contract(abi, null, {data});
    contractClass.deploy({
      arguments: contract.arguments
    }).send({
      from: account,
      gas: 1500000,
      gasPrice
    }, function(error, transactionHash){
    }).on('error', function(error){
      console.error(error)
    }).on('transactionHash', function(transactionHash){
    }).on('receipt', function(receipt){
    })
  });
};

const deploySingle = function(name) {
  let contract = contracts.find(c => c.name === name);
  return deploy(contract);
};

const deployAll = function() {
  contracts.map((contract) => {
    deploy(contract);
  });
};

deployAll();

module.exports = {
  deploySingle
};
