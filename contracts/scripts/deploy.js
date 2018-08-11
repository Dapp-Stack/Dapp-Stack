#!/usr/bin/env node

let fs = require("fs");
let Web3 = require('web3');
(async function() {  // Create a web3 connection to a running geth node over JSON-RPC running at
  // http://localhost:8545
  // For geth VPS server + SSH tunneling see
  // https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
  let web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

  // Read the compiled contract code
  // Compile with
  let source = fs.readFileSync(`${__dirname}/../build/Apps/SimpleStorage.sol/combined.json`);
  let contracts = JSON.parse(source)["contracts"];
  let key = Object.keys(contracts)[0]

  // ABI description as JSON structure
  let abi = JSON.parse(contracts[key].abi);

  // Smart contract EVM bytecode as hex
  let code = '0x' + contracts[key].bin;
  let accounts = await web3.eth.getAccounts();
  let gasPrice = await web3.eth.getGasPrice();
  let contract = new web3.eth.Contract(abi, null, {data: code});
  contract.deploy({
    arguments: [10]
  }).send({
    from: accounts[0],
    gas: 1500000,
    gasPrice: '30000000000000'
  }, function(error, transactionHash){
    console.log(error)
  }).on('error', function(error){
    console.log(error)
  }).on('transactionHash', function(transactionHash){
    console.log(transactionHash)
  }).on('receipt', function(receipt){
    console.log(receipt) // contains the new contract address
  })
})();
