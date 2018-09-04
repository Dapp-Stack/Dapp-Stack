import * as spawn from 'cross-spawn';
import * as path from 'path';

export function startWeb() {
  const reactScriptsPath = path.resolve(process.cwd(), 'node_modules', 'react-scripts', 'scripts', 'start.js');
  let reactScriptsProcess = spawn('node', [reactScriptsPath], { stdio: 'ignore' });

  reactScriptsProcess.on("message", (message: string) => {

  });

  reactScriptsProcess.on("exit", (code: number, signal: string) => {

  });

  reactScriptsProcess.on("error", (err: Error) => {

  });

  reactScriptsProcess.on("disconnect", () => {

  });

  reactScriptsProcess.on("close", (code: number, signal: string) => {

  });
}