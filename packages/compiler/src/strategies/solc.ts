import { Compile } from '@solon/environment';
import { Signale } from 'signale';
import { ICompileStrategy } from '../types';


export class Solc implements ICompileStrategy {
  private contractName: string;
  private config: Compile;
  private signale: Signale;

  constructor(contractName: string, config: Compile, signale: Signale) {
    this.contractName= contractName;
    this.config = config;
    this.signale = signale;
  }

  compile = () => {
    this.signale.await(`Starting to compile ${this.contractName}`)
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  }
}

// const compilersMapping: CompilerMapping = {
//   async sol(contractName: string, environment: Environment) {
//     const { src, build } = environment.structure.contracts;
//     const command = [
//       '-o',
//       `/solidity/build/${contractName}`,
//       '--allow-paths',
//       '/solidity/src',
//       '--optimize',
//       '--combined-json',
//       'abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc',
//       '--overwrite',
//       `/solidity/src/${contractName}`,
//     ];
//     const options = {
//       Binds: [`${path.join(process.cwd(), src)}:/solidity/src`, `${path.join(process.cwd(), build)}:/solidity/build`],
//     };
//     await downloadImage();
//     return docker.run(IMAGE_NAME, command, process.stdout, options).then(container => container.remove());
//   },
//   notFound() {
//     return new Promise(resolve => resolve());
//   },
// };

// export function compile(contractName: string, environment: Environment): Promise<void> {
//   const type: string = Object.keys(compilersMapping).find((t: string) => contractName.endsWith(t)) || 'notFound';

//   return compilersMapping[type](contractName, environment);
// }

// function downloadImage(): Promise<boolean> {
//   return new Promise<boolean>(async (resolve, reject) => {
//     docker.pull(IMAGE_NAME, {}, (err, stream) => {
//       if (err) {
//         return reject(err);
//       }
//       docker.modem.followProgress(stream, onFinished);

//       function onFinished() {
//         return resolve(true);
//       }
//     });
//   });
// }
