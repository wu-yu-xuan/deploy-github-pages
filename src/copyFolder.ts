import { cp, mkdirP } from '@actions/io';
import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { info } from '@actions/core';

export default async function copyFolder(source: string, dest: string) {
  const copyOpts = { recursive: true, force: true };
  if (!existsSync(dest)) {
    mkdirP(dest);
  }
  const files = readdirSync(source);
  for (const file of files) {
    if (file.endsWith('.git') || file.endsWith('.github')) {
      continue;
    }
    const filePath = resolve(source, file);
    await cp(filePath, dest, copyOpts);
  }
  info(`successfully copied from ${source} into ${dest}`);
}
