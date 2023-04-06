import path from 'path';
import core from '@actions/core';
import io from '@actions/io';
import exec from '@actions/exec';

const prepareProject = async (options) => {
  const {
    projectCodePath,
    projectPath,
    projectSourcePath,
    mountPath,
    verbose,
  } = options;
  const cmdOptions = { silent: !verbose };

  const projectImageName = `rpill123/docker-tests-app:latest`;
  await io.mkdirP(projectSourcePath);
  const pullCmd = `docker pull ${projectImageName}"`;
  await exec.exec(pullCmd, null, cmdOptions);
  const copyCmd = `docker run -v ${mountPath}:/mnt ${projectImageName} bash -c "cp -r /project/. /mnt/source"`;
  await exec.exec(copyCmd, null, cmdOptions);
  await io.mkdirP(projectCodePath);
  await io.cp(`${projectPath}/.`, projectCodePath, { recursive: true });
  await exec.exec('docker', ['build', '--cache-from', projectImageName, '.'], { ...cmdOptions, cwd: projectSourcePath });
};

const checkProject = async ({ projectSourcePath }) => {
  const options = { cwd: projectSourcePath };
  await exec.exec('docker-compose', ['run', 'app', 'make', 'setup'], options);
  await exec.exec('docker-compose', ['-f', 'docker-compose.yml', 'up', '--abort-on-container-exit'], options);
};

export const runTests = async (params) => {
  const { mountPath } = params;
  const projectSourcePath = path.join(mountPath, 'source');
  const projectCodePath = path.join(projectSourcePath, 'code');

  const options = {
    ...params,
    projectSourcePath,
    projectCodePath,
  };

  await core.group('Preparing', () => prepareProject(options));
  await core.group('Tests', () => checkProject(options));
};