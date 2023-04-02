/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// import core from '@actions/core';
// import github from '@actions/github';
// import exec from '@actions/exec';
const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

// const mapping = {
//   'express-mesto-13': {
//     bin: ''
//   }
// }

const runTests = async () => {
  try {
    const projectName = core.getInput('project', { required: true });
    const projectPath = process.cwd();
    const cmdOptions = { cwd: projectPath };
    await exec.exec(`sh ./bin/${projectName}.sh`, null, cmdOptions);
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

try {
  runTests(params);
} catch (e) {
  core.error('Tests failed');
  throw e;
}
