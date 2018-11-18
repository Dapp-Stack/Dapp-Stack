declare module 'glob';

export function glob(pattern: string, options: any, cb: (err: Error | null, matches: string[]) => void): void;
