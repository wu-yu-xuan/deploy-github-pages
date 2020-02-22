import git from './git';
import inputs from './inputs';
import { info } from '@actions/core';
import { resolve } from 'path';

export default async function prepareProject(workDir: string) {
  try {
    await git(
      'clone',
      '--depth=1',
      '--single-branch',
      '--branch',
      inputs.publishBranch,
      inputs.remoteUrl,
      workDir
    );
    if (inputs.keepFiles) {
      info('keeping existing files');
    } else {
      await git('rm', '-r', '--ignore-unmatch', resolve(inputs.destDir, '*'));
    }
  } catch {
    info(`first deploy, creating new branch ${inputs.publishBranch}`);
    await git('init');
    await git('checkout', '--orphan', inputs.publishBranch);
    await git('remote', 'add', 'origin', inputs.remoteUrl);
  }
}
