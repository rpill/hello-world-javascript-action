import core from '@actions/core';
import github from '@actions/github';
import exec from '@actions/exec';

try {
  const projectName = core.getInput('project', { required: true });
  console.log(projectName);
  console.log(process.cwd());
  console.log(process.env);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}