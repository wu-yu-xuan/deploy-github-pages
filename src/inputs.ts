import { getInput, info } from '@actions/core';
import { context } from '@actions/github';

const inputs = {
  personalToken: getInput('personal_token', { required: true }),
  publishBranch: getInput('publish_branch'),
  sourceDir: getInput('source_dir'),
  destDir: getInput('dest_dir'),
  userName: getInput('user_name') || context.actor,
  userEmail:
    getInput('user_email') || `${context.actor}@users.noreply.github.com`,
  keepFiles: getInput('keep_files').toLowerCase() === 'true',
  publishRepo:
    getInput('publish_repo') || `${context.repo.owner}/${context.repo.repo}`,
  get remoteUrl() {
    return `https://x-access-token:${this.personalToken}@github.com/${this.publishRepo}.git`;
  },
  get commitMessage() {
    const message = getInput('commit_message') || 'deploy@';
    /**
     * @see https://help.github.com/en/github/writing-on-github/autolinked-references-and-urls#commit-shas
     */
    const repo =
      inputs.publishRepo === `${context.repo.owner}/${context.repo.repo}`
        ? ''
        : `${context.repo.owner}/${context.repo.repo}`;
    return `${message} ${repo}@${context.sha}`;
  }
} as const;

Object.entries(inputs).forEach(([key, value]) => info(`${key}: ${value}`));

export default inputs;
