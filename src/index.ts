import { info, setFailed } from '@actions/core';
import { resolve } from 'path';
import setGitUser from './setGitUser';
import copyFolder from './copyFolder';
import prepareWorkDir from './prepareWorkDir';
import prepareProject from './prepareProject';
import commitPush from './commitPush';
import inputs from './inputs';

async function run() {
  try {
    const sourceDir = resolve(process.cwd(), inputs.sourceDir);
    const workDir = await prepareWorkDir();
    await prepareProject(workDir);
    await copyFolder(sourceDir, resolve(workDir, inputs.destDir));
    await setGitUser();
    await commitPush();
    info('deploy complete!');
  } catch (e) {
    setFailed(`Action failed with ${e}`);
  }
}

run();
