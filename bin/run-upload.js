import core from '@actions/core';
import cleanStack from 'clean-stack';
import { runUpload } from '../src/index.js';

const mountPath = '/var/tmp';
const projectName = core.getInput('project', { required: true });
const verbose = core.getInput('verbose', { required: false });
const projectPath = process.cwd();

const params = {
  mountPath, projectPath, verbose, projectName
};

try {
  await runUpload(params);
} catch (e) {
  if (!verbose) {
    e.stack = cleanStack(e.stack);
  }
  throw e;
}