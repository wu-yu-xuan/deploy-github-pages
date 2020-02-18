import getInputs from './getInputs';
import { context } from '@actions/github';
import { tmpdir } from 'os';
import { info, setFailed } from '@actions/core';
import { cp, mkdirP } from '@actions/io';
import { resolve } from 'path';
import setGitUser from './setGitUser';
import git from './git';

async function run() {
  try {
    const {
      publishBranch,
      personalToken,
      publishDir,
      userName,
      userEmail,
      commitMessage
    } = getInputs();
    const remoteUrl = `https://x-access-token:${personalToken}@github.com/${context.repo.owner}/${context.repo.repo}.git`;
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
      await git('rm', '-r', '--ignore-unmatch', '*');
    } catch {
      info(`first deploy, creating new branch ${publishBranch}`);
      process.chdir(workDir);
      await git('init');
      await git('checkout', '--orphan', publishBranch);
      git('remote', 'add', 'origin', remoteUrl);
    }
    await cp(resolve(fullPublishDir, '*'), workDir, {
      recursive: true,
      force: true
    });
    await setGitUser(userName, userEmail);
    git('add', '--all');
    git('commit', '-m', commitMessage);
    git('push', 'origin', publishBranch);
  } catch (e) {
    setFailed(`Action failed with ${e}`);
  }
}

run();
