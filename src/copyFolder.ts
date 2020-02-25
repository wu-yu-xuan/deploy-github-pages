import { cp, mkdirP } from '@actions/io';
import { readdirSync, existsSync, statSync } from 'fs';
import { resolve } from 'path';
import { info } from '@actions/core';

const copyOpts = { recursive: true, force: true };

export default async function copyFolder(source: string, dest: string) {
  if (!existsSync(dest)) {
    mkdirP(dest);
  }
  const files = readdirSync(source);
  for (const file of files) {
    if (file.endsWith('.git') || file.endsWith('.github')) {
      continue;
    }
    const filePath = resolve(source, file);
    const targetPath = resolve(dest, file);
    const status = statSync(filePath);
    if (status.isDirectory()) {
      copyFolder(filePath, targetPath);
    } else {
      await cp(filePath, targetPath, copyOpts);
    }
  }
  info(`successfully copied from ${source} into ${dest}`);
}
