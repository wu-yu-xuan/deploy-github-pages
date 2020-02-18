import { exec } from '@actions/exec';

export default function git(...args: string[]) {
  return exec('git', args);
}
