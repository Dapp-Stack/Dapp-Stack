import * as spawn from 'cross-spawn';
import * as path from 'path';

export function startWeb() {
  const reactScriptsPath = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts');
  let reactScriptsProcess = spawn('node', [reactScriptsPath, 'start']);

  reactScriptsProcess.on("message", (message: string) => {
    console.log(message)
  });

  reactScriptsProcess.on("exit", (code: number, signal: string) => {

  });

  reactScriptsProcess.on("error", (err: Error) => {
    console.log(err)
  });

  reactScriptsProcess.on("disconnect", () => {

  });

  reactScriptsProcess.on("close", (code: number, signal: string) => {
    console.log(code)
    console.log(signal)
  });
}