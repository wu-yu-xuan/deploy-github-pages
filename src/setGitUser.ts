import git from './git';
import inputs from './inputs';

export default async function setGitUser() {
  return Promise.all([
    git('config', 'user.name', inputs.userName),
    git('config', 'user.email', inputs.userEmail)
  ]);
}
