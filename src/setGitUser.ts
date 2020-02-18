import git from './git';

export default async function setGitUser(userName: string, userEmail: string) {
  return Promise.all([
    git('config', 'user.name', userName),
    git('config', 'user.email', userEmail)
  ]);
}
