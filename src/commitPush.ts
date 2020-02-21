import git from './git';
import inputs from './inputs';
import { warning } from '@actions/core';

export default async function commitPush() {
  await git('add', '--all');
  try {
    // nothing to commit will not return 0
    await git('commit', '-m', inputs.commitMessage);
  } catch {
    warning('skip commit because nothing to commit or run git hook fail');
  }
  await git('push', 'origin', inputs.publishBranch);
}
