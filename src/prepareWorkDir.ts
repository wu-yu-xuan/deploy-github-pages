import { resolve } from 'path';
import { tmpdir } from 'os';
import { context } from '@actions/github';
import { mkdirP } from '@actions/io';
import { info } from '@actions/core';

export default async function prepareWorkDir() {
  const workDir = resolve(
    tmpdir(),
    context.repo.owner,
    context.repo.repo,
    context.sha
  );
  await mkdirP(workDir);
  process.chdir(workDir);
  info(`working in ${workDir}`);
  return workDir;
}
