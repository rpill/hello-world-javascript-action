import core from '@actions/core';
// import github from '@actions/github';
import exec from '@actions/exec';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// const mapping = {
//   'express-mesto-13': {
//     bin: ''
//   }
// }

const runTests = async () => {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    console.log(__dirname);
    console.log(process.cwd());
    const projectName = core.getInput('project', { required: true });
    const projectPath = process.cwd();
    const cmdOptions = { cwd: projectPath };
    const binPath = path.join(__dirname, '..', 'bin', `${projectName}.sh`)
    // await exec.exec(`sh ${binPath}`, null, cmdOptions);
    await exec.exec(`ls -R`, null, cmdOptions);
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

try {
  await runTests();
} catch (e) {
  core.error('Tests failed');
  throw e;
}