import fs from 'fs';
import path from 'path';
import core from '@actions/core';
import io from '@actions/io';
import exec from '@actions/exec';
import artifact from '@actions/artifact';
import glob from '@actions/glob';

const uploadArtifacts = async (outputsPath) => {
  if (!fs.existsSync(outputsPath)) {
    return;
  }

  const outputsStats = fs.statSync(outputsPath);
  if (!outputsStats.isDirectory()) {
    return;
  }

  const globber = await glob.create(`${outputsPath}/**`);
  const filepaths = await globber.glob();

  if (filepaths.length === 0) {
    return;
  }

  const artifactClient = artifact.create();
  await artifactClient.uploadArtifact('outputs', filepaths, outputsPath)
}

const prepareProject = async (options) => {
  const {
    projectName,
    projectCodePath,
    projectPath,
    projectSourcePath,
    mountPath,
    verbose,
  } = options;
  const cmdOptions = { silent: !verbose };

  const projectImageName = `practicumweb/gha-verstka-checker:latest`;
  await io.mkdirP(projectSourcePath);
  const pullCmd = `docker pull -q ${projectImageName}"`;
  await exec.exec(pullCmd, null, cmdOptions);
  const copyCmd = `docker run -v ${mountPath}:/mnt ${projectImageName} bash -c "cp -r /project/. /mnt/source && rm -rf /mnt/source/code"`;
  await exec.exec(copyCmd, null, cmdOptions);
  await io.mkdirP(projectCodePath);
  await io.cp(`${projectPath}/.`, projectCodePath, { recursive: true });
  await exec.exec('docker', ['build', '-q', '-t', projectImageName, '--cache-from', projectImageName, '.'], { ...cmdOptions, cwd: projectSourcePath });
  await exec.exec('docker-compose', ['run', 'app', 'make', 'setup', `PROJECT_NAME=${projectName}`], { ...cmdOptions, cwd: projectSourcePath });
};

const checkProject = async (options) => {
  const {
    projectSourcePath,
  } = options;
  const cmdOptions = { cwd: projectSourcePath };
  await exec.exec('docker-compose', ['-f', 'docker-compose.yml', 'up', '--abort-on-container-exit'], cmdOptions);
};

export const runTests = async (params) => {
  const { mountPath } = params;
  const projectSourcePath = path.join(mountPath, 'source');
  const projectCodePath = path.join(projectSourcePath, 'code');
  const outputsPath = path.join(projectSourcePath, 'outputs');

  const options = {
    ...params,
    projectSourcePath,
    projectCodePath,
  };

  await core.group('Preparing', () => prepareProject(options));
  await core.group('Tests', () => checkProject(options));
  await core.group('Upload artifacts', () => uploadArtifacts(outputsPath));
};

export const runUpload = async (params) => {
  const { mountPath } = params;
  const outputsPath = path.join(mountPath, 'source', 'outputs');

  await core.group('Upload artifacts', () => uploadArtifacts(outputsPath));
};