import { getInput, info } from '@actions/core';
import { context } from '@actions/github';

export default function getInputs() {
  const inputs = {
    personalToken: getInput('personal_token', { required: true }),
    publishBranch: getInput('publish_branch'),
    publishDir: getInput('publish_dir'),
    userName: getInput('user_name') || context.actor,
    userEmail:
      getInput('user_email') || `${context.actor}@users.noreply.github.com`,
    commitMessage: `${getInput('commit_message') || 'deploy@'} ${context.sha}`,
    keepFiles: getInput('keep_files').toLowerCase() === 'true',
    publishRepo:
      getInput('publish_repo') || `${context.repo.owner}/${context.repo.repo}`
  };
  Object.entries(inputs).forEach(([key, value]) => info(`${key}: ${value}`));
  return inputs;
}
