import core from '@actions/core';
import cleanStack from 'clean-stack';
import { runTests } from '../src/index.js';

core.exportVariable('COMPOSE_DOCKER_CLI_BUILD', 1);
core.exportVariable('DOCKER_BUILDKIT', 1);

const mountPath = '/var/tmp';
const projectName = core.getInput('project', { required: true });
const verbose = core.getInput('verbose', { required: false });
const projectPath = process.cwd();

const params = {
  mountPath, projectPath, verbose, projectName
};

try {
  await runTests(params);
} catch (e) {
  // core.setFailed('Тесты завершились с ошибкой. Откройте выше вкладку Tests и исправьте ошибки.');
  console.error('Тесты завершились с ошибкой. Откройте выше вкладку Tests и исправьте ошибки.');
  console.log = () => { }
  process.exit(1);
  if (verbose) {
    // e.stack = cleanStack(e.stack);
    throw e;
  }
}