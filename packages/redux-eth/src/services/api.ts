import * as ethers from 'ethers';
import { BuildContractsInput } from '../types';

declare global {
  interface Window {
    web3?: any;
    ethereum?: any;
  }
}

const error = new Error('Non-Ethereum browser detected. You should consider trying MetaMask!');

export const connect = () => {
  return new Promise<ethers.providers.Web3Provider>(async (resolve, reject) => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        return resolve(provider);
      } catch (error) {
        return reject(error);
      }
    } else if (window.web3) {
      const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
      return resolve(provider);
    } else {
      return reject();
    }
  });
};

export const getNetwork = (provider: ethers.providers.Web3Provider | undefined) => {
  return new Promise<ethers.utils.Network>((_resolve, reject) => {
    if (!provider) return reject(error);
    return provider.getNetwork();
  });
};

export const getGasPrice = async (provider: ethers.providers.Web3Provider | undefined) => {
  return new Promise<ethers.utils.BigNumber>((_resolve, reject) => {
    if (!provider) return reject(error);
    return provider.getGasPrice();
  });
};

export const getContracts = (provider: ethers.providers.Web3Provider | undefined, input: BuildContractsInput) => {
  return new Promise<ethers.Contract[]>((resolve, reject) => {
    if (!provider) return reject(error);
    const names = Object.keys(input);
    const contracts = names.map(name => new ethers.Contract(input[name].address, input[name].abi, provider))
    resolve(contracts);
  });
};