import getInputs from './getInputs';
import { context } from '@actions/github';
import { tmpdir } from 'os';
import { info, setFailed, warning } from '@actions/core';
import { mkdirP } from '@actions/io';
import { resolve } from 'path';
import setGitUser from './setGitUser';
import git from './git';
import copyFolder from './copyFolder';

async function run() {
  try {
    const {
      publishBranch,
      personalToken,
      publishDir,
      userName,
      userEmail,
      commitMessage,
      keepFiles,
      publishRepo
    } = getInputs();
    const remoteUrl = `https://x-access-token:${personalToken}@github.com/${publishRepo}.git`;
    info(`remote url: ${remoteUrl}`);
    const fullPublishDir = resolve(process.cwd(), publishDir);
    const workDir = resolve(
      tmpdir(),
      context.repo.owner,
      context.repo.repo,
      context.sha
    );
    await mkdirP(workDir);
    info(`working in ${workDir}`);
    try {
      await git(
        'clone',
        '--depth=1',
        '--single-branch',
        '--branch',
        publishBranch,
        remoteUrl,
        workDir
      );
      process.chdir(workDir);
      if (keepFiles) {
        info('keeping existing files');
      } else {
        await git('rm', '-r', '--ignore-unmatch', '*');
      }
    } catch {
      info(`first deploy, creating new branch ${publishBranch}`);
      process.chdir(workDir);
      await git('init');
      await git('checkout', '--orphan', publishBranch);
      await git('remote', 'add', 'origin', remoteUrl);
    }
    await copyFolder(fullPublishDir, workDir);
    await setGitUser(userName, userEmail);
    await git('add', '--all');
    try {
      // nothing to commit will not return 0
      await git('commit', '-m', commitMessage);
    } catch {
      warning('skip commit because nothing to commit or run git hook fail');
    }
    await git('push', 'origin', publishBranch);
    info('deploy complete!');
  } catch (e) {
    setFailed(`Action failed with ${e}`);
  }
}

run();
