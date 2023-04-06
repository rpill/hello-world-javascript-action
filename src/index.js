import core from '@actions/core';
import cleanStack from 'clean-stack';
import { runTests } from './tests.js';

core.exportVariable('COMPOSE_DOCKER_CLI_BUILD', 1);
core.exportVariable('DOCKER_BUILDKIT', 1);

const mountPath = '/var/tmp';
const projectName = core.getInput('project', { required: true });
const projectPath = process.cwd();

const params = {
  mountPath, projectPath, verbose,
};

try {
  await runTests(params);
} catch (e) {
  core.error('Исправьте ошибки');
  if (!verbose) {
    e.stack = cleanStack(e.stack);
  }
  throw e;
}