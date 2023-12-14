import fs from 'node:fs';

export function readLines(path: string): string[] {
  return fs.readFileSync(path).toString().split('\n');
}
