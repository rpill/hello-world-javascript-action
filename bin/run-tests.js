import core from '@actions/core';
import cleanStack from 'clean-stack';
import { runTests } from '../src/index.js';

process.on('uncaughtException', (error) => {
  process.exit(1);
});

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
  console.log("\x1b[1;31m%s\x1b[0m", 'Тесты завершились с ошибкой. Откройте выше вкладку Tests и исправьте ошибки.');

  if (verbose) {
    // e.stack = cleanStack(e.stack);
    throw e;
  }
  process.exit(1);
}