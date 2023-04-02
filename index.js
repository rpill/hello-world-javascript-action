import core from '@actions/core';
import github from '@actions/github';
import exec from '@actions/exec';

// const mapping = {
//   'express-mesto-13': {
//     bin: ''
//   }
// }
console.log(1);
// const runTests = async () => {
//   try {
//     const projectName = core.getInput('project', { required: true });
//     const projectPath = process.cwd();
//     const cmdOptions = { cwd: projectPath };
//     await exec.exec(`sh ./bin/${projectName}.sh`, null, cmdOptions);
//     // Get the JSON webhook payload for the event that triggered the workflow
//     // const payload = JSON.stringify(github.context.payload, undefined, 2)
//     // console.log(`The event payload: ${payload}`);
//   } catch (error) {
//     core.setFailed(error.message);
//   }
// }

// try {
//   await runTests(params);
// } catch (e) {
//   core.error('Tests failed');
//   throw e;
// }